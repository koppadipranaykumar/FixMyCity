package com.fixmycity_api.community.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class CommunityDTO {

    private long totalCitizens;

    private long totalIssues;

    private long resolvedIssues;

    private long inProgressIssues;

    private long reportedIssues;

    private List<ContributorDTO> topContributors;

    private List<CommunityIssueDTO> latestResolvedIssues;

}