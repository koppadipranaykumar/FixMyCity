package com.fixmycity_api.issue;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueRepository
        extends JpaRepository<Issue, Long> {
	List<Issue> findByReportedBy(String reportedBy);
}