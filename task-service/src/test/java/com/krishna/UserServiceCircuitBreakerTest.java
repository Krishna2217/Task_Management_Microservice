package com.krishna;

import com.github.tomakehurst.wiremock.client.WireMock;
import com.krishna.modal.UserDto;
import com.krishna.service.UserService;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static org.assertj.core.api.Assertions.assertThat;

// verifies task-service does not hang when USER-SERVICE is down: the userService
// circuit breaker must open after enough failures, and every call - open or closed -
// must return the UserServiceFallback response well within the 5s DoD budget
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles("test")
@AutoConfigureWireMock(port = 0)
// redirects the USER-SERVICE Feign client straight at WireMock, no Eureka needed
@TestPropertySource(properties = "spring.cloud.discovery.client.simple.instances.USER-SERVICE[0].uri=http://localhost:${wiremock.server.port}")
class UserServiceCircuitBreakerTest {

    @Autowired
    private UserService userService;

    @Autowired
    private CircuitBreakerRegistry circuitBreakerRegistry;

    @BeforeEach
    void resetCircuitBreaker() {
        circuitBreakerRegistry.circuitBreaker("userService").reset();
        WireMock.stubFor(get(urlEqualTo("/api/users/profile"))
                .willReturn(aResponse().withStatus(500)));
    }

    @Test
    void openCircuitAfterRepeatedFailures_andAlwaysReturnFallbackWithinTimeout() {
        CircuitBreaker breaker = circuitBreakerRegistry.circuitBreaker("userService");

        // minimumNumberOfCalls=10, failureRateThreshold=50%: 10 failing calls trip it open
        for (int i = 0; i < 10; i++) {
            long start = System.currentTimeMillis();
            UserDto result = userService.getUserProfile("Bearer test-token");
            long elapsedMs = System.currentTimeMillis() - start;

            assertThat(result.getId()).isEqualTo(-1L);
            assertThat(result.getRole()).isEqualTo("UNKNOWN");
            assertThat(elapsedMs).isLessThan(5000);
        }

        assertThat(breaker.getState()).isEqualTo(CircuitBreaker.State.OPEN);

        // once open, calls must short-circuit to the fallback without hitting WireMock at all
        long start = System.currentTimeMillis();
        UserDto result = userService.getUserProfile("Bearer test-token");
        long elapsedMs = System.currentTimeMillis() - start;

        assertThat(result.getId()).isEqualTo(-1L);
        assertThat(elapsedMs).isLessThan(5000);
    }
}
