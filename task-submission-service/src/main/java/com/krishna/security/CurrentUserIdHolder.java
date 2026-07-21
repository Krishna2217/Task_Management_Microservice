package com.krishna.security;

// task-service never validates JWTs itself (see CLAUDE.md); every write-path controller
// method resolves the caller via the UserService Feign call before touching the repository,
// so we stash that resolved id here for JPA auditing (@CreatedBy/@LastModifiedBy) to read.
public final class CurrentUserIdHolder {

    private static final ThreadLocal<Long> CURRENT_USER_ID = new ThreadLocal<>();

    private CurrentUserIdHolder() {
    }

    public static void set(Long userId) {
        CURRENT_USER_ID.set(userId);
    }

    public static Long get() {
        return CURRENT_USER_ID.get();
    }

    public static void clear() {
        CURRENT_USER_ID.remove();
    }
}
