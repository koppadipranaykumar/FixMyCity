package com.fixmycity_api.issue;

import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueRepository
        extends JpaRepository<Issue, Long> {
}