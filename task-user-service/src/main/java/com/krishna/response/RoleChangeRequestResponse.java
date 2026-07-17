package com.krishna.response;

import com.krishna.modal.RoleChangeRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoleChangeRequestResponse {
    private Long id;
    private Long userId;
    private String currentRole;
    private String requestedRole;
    private String status;
    private LocalDateTime requestedAt;

    public static RoleChangeRequestResponse from(RoleChangeRequest request) {
        return new RoleChangeRequestResponse(
                request.getId(),
                request.getUserId(),
                request.getCurrentRole(),
                request.getRequestedRole(),
                request.getStatus(),
                request.getRequestedAt()
        );
    }
}
