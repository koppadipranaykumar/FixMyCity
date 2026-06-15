package com.fixmycity_api.dashboard;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fixmycity_api.issue.Issue;
import com.fixmycity_api.issue.IssueRepository;
import com.fixmycity_api.worker.WorkerRepository;

@Service
public class DashboardService {

    private final IssueRepository issueRepository;
    private final WorkerRepository workerRepository;

    public DashboardService(
            IssueRepository issueRepository,
            WorkerRepository workerRepository
    ) {
        this.issueRepository = issueRepository;
        this.workerRepository = workerRepository;
    }

    public Map<String, Object> getStats() {

        Map<String, Object> stats =
                new HashMap<>();

        List<Issue> issues =
                issueRepository.findAll();

        stats.put(
                "totalIssues",
                issues.size()
        );

        stats.put(
                "reported",
                issues.stream()
                        .filter(i ->
                                "Reported".equalsIgnoreCase(
                                        i.getStatus()
                                ))
                        .count()
        );

        stats.put(
                "inProgress",
                issues.stream()
                        .filter(i ->
                                "In Progress".equalsIgnoreCase(
                                        i.getStatus()
                                ))
                        .count()
        );

        stats.put(
                "resolved",
                issues.stream()
                        .filter(i ->
                                "Resolved".equalsIgnoreCase(
                                        i.getStatus()
                                ))
                        .count()
        );

        stats.put(
                "workers",
                workerRepository.count()
        );

        return stats;
    }
}