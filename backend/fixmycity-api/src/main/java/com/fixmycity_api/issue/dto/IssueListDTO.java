package com.fixmycity_api.issue.dto;

import com.fixmycity_api.issue.Issue;
import java.time.LocalDateTime;

public record IssueListDTO(
    Long id,
    String title,
    String description,
    String category,
    String location,
    String status,
    String assignedWorker,
    String resolutionNote,
    String reportedBy,
    Double latitude,
    Double longitude,
    LocalDateTime reportedAt,
    LocalDateTime resolvedAt
) {
    public static IssueListDTO from(Issue issue) {
        return new IssueListDTO(
            issue.getId(),
            issue.getTitle(),
            issue.getDescription(),
            issue.getCategory(),
            issue.getLocation(),
            issue.getStatus(),
            issue.getAssignedWorker(),
            issue.getResolutionNote(),
            issue.getReportedBy(),
            issue.getLatitude(),
            issue.getLongitude(),
            issue.getReportedAt(),
            issue.getResolvedAt()
        );
    }
}
