package com.fixmycity_api.assignment;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long issueId;

    private Long workerId;

    private String workerName;

    private LocalDateTime assignedAt;

    // getters setters
}