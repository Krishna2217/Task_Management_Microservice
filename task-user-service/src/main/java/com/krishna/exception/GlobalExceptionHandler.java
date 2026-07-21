package com.krishna.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private ProblemDetail problemDetail(HttpStatus status, String title, String errorCode, String detail, HttpServletRequest request) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, detail);
        pd.setTitle(title);
        pd.setProperty("errorCode", errorCode);
        pd.setProperty("timestamp", Instant.now());
        pd.setProperty("path", request.getRequestURI());
        return pd;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        ProblemDetail pd = problemDetail(HttpStatus.BAD_REQUEST, "Validation Failed", "VALIDATION_ERROR",
                "One or more fields are invalid", request);
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fe.getField(), fe.getDefaultMessage());
        }
        pd.setProperty("fieldErrors", fieldErrors);
        return pd;
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ProblemDetail handleUserAlreadyExists(UserAlreadyExistsException ex, HttpServletRequest request) {
        return problemDetail(HttpStatus.CONFLICT, "User Already Exists", "USER_ALREADY_EXISTS", ex.getMessage(), request);
    }

    // last line of defense against the uk_user_email race: two signups for the same email can both
    // pass the application-level findByEmail check before either commits, so the DB constraint is
    // what actually stops the duplicate - without this handler that violation would surface as a 500
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ProblemDetail handleDataIntegrityViolation(DataIntegrityViolationException ex, HttpServletRequest request) {
        return problemDetail(HttpStatus.CONFLICT, "Conflict", "DATA_INTEGRITY_VIOLATION",
                "The request could not be completed because it conflicts with existing data", request);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ProblemDetail handleUsernameNotFound(UsernameNotFoundException ex, HttpServletRequest request) {
        return problemDetail(HttpStatus.NOT_FOUND, "Not Found", "USER_NOT_FOUND", ex.getMessage(), request);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ProblemDetail handleBadCredentials(BadCredentialsException ex, HttpServletRequest request) {
        return problemDetail(HttpStatus.UNAUTHORIZED, "Unauthorized", "BAD_CREDENTIALS", ex.getMessage(), request);
    }

    @ExceptionHandler(InvalidRefreshTokenException.class)
    public ProblemDetail handleInvalidRefreshToken(InvalidRefreshTokenException ex, HttpServletRequest request) {
        return problemDetail(HttpStatus.UNAUTHORIZED, "Unauthorized", "INVALID_REFRESH_TOKEN", ex.getMessage(), request);
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGeneral(Exception ex, HttpServletRequest request) {
        log.error("Unhandled exception on {}", request.getRequestURI(), ex);
        return problemDetail(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", "INTERNAL_ERROR", ex.getMessage(), request);
    }
}
