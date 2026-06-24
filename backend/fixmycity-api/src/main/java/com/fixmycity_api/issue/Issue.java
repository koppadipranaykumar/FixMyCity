package com.fixmycity_api.issue;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fixmycity_api.user.User;

@Entity
@Table(name = "issues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private String category;
    private String location;
    private String assignedWorker;

    @Column(columnDefinition = "TEXT")
    private String resolutionNote;

    @Column(columnDefinition = "TEXT")
    private String proofImage;

    private LocalDateTime reportedAt;
    private LocalDateTime resolvedAt;

    private String status;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    private Double latitude;
    private Double longitude;

    private String imageName;
    private String reportedBy;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
}