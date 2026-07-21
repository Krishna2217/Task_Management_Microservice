package com.krishna.config;

import com.krishna.modal.User;
import com.krishna.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

// jwtTokenValidator authenticates on email (the JWT's principal), not id, so this resolves
// the id JPA auditing needs (createdBy/updatedBy) with one extra lookup by email.
@Component
public class CurrentUserAuditorAware implements AuditorAware<Long> {

    @Autowired
    private UserRepository userRepository;

    @Override
    public Optional<Long> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // AnonymousAuthenticationToken.isAuthenticated() is true, so it must be excluded explicitly;
        // querying findByEmail() for it would otherwise run a User lookup while a User row may
        // already be dirty in the same flush, re-entering this same auditing callback recursively
        if (authentication == null || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            return Optional.empty();
        }
        String email = String.valueOf(authentication.getPrincipal());
        User user = userRepository.findByEmail(email);
        return Optional.ofNullable(user).map(User::getId);
    }
}
