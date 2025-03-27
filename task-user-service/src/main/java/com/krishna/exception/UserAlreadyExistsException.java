package com.krishna.exception;

public class UserAlreadyExistsException extends Exception {
    public UserAlreadyExistsException(String emailAlreadyExist) {
        super(emailAlreadyExist);
    }
}
