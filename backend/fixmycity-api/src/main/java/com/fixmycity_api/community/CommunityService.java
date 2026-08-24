package com.fixmycity_api.community;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fixmycity_api.community.dto.CommunityDTO;
import com.fixmycity_api.community.dto.CommunityIssueDTO;
import com.fixmycity_api.community.dto.ContributorDTO;
import com.fixmycity_api.issue.Issue;
import com.fixmycity_api.issue.IssueRepository;
import com.fixmycity_api.user.UserRepository;

@Service
public class CommunityService {

    private final IssueRepository issueRepository;
    private final UserRepository userRepository;

    public CommunityService(
            IssueRepository issueRepository,
            UserRepository userRepository
    ) {
        this.issueRepository = issueRepository;
        this.userRepository = userRepository;
    }

    public CommunityDTO getCommunityData() {

        long totalCitizens = userRepository.count();

        long totalIssues = issueRepository.count();

        long reportedIssues =
                issueRepository.countByStatus("Reported");

        long inProgressIssues =
                issueRepository.countByStatus("In Progress");

        long resolvedIssues =
                issueRepository.countByStatus("Resolved");


        /*
         * Top Contributors
         */

        List<Object[]> contributors =
                issueRepository.getTopContributors();

        List<ContributorDTO> contributorList =
                new ArrayList<>();

        contributors.stream()
                .limit(5)
                .forEach(row -> {

                    contributorList.add(

                            new ContributorDTO(

                                    (String) row[0],

                                    ((Long) row[1])

                            )

                    );

                });


        /*
         * Latest Resolved Issues
         */

        List<Issue> latestResolved =
                issueRepository
                        .findTop5ByStatusOrderByResolvedAtDesc(
                                "Resolved"
                        );

        List<CommunityIssueDTO> latestIssues =
                new ArrayList<>();

        for (Issue issue : latestResolved) {

            latestIssues.add(

                    new CommunityIssueDTO(

                            issue.getId(),

                            issue.getTitle(),

                            issue.getCategory(),

                            issue.getLocation()

                    )

            );

        }

        return new CommunityDTO(

                totalCitizens,

                totalIssues,

                resolvedIssues,

                inProgressIssues,

                reportedIssues,

                contributorList,

                latestIssues

        );

    }

}