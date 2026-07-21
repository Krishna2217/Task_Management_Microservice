package com.krishna.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 8)
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).{8,}$",
            message = "Password must be at least 8 characters and contain at least one letter and one digit")
    private String password;

    @NotBlank
    private String fullName;

    // optional: ignored server-side (every signup becomes ROLE_USER), only validated if present
    @Pattern(regexp = "ROLE_USER|ROLE_ADMIN|ROLE_TEACHER|ROLE_STUDENT|ROLE_PROJECT_HEAD|ROLE_DEVELOPER")
    private String role;
}
