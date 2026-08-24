package com.fixmycity_api.community;

import com.fixmycity_api.community.dto.CommunityIssueDTO;
import com.fixmycity_api.community.dto.ContributorDTO;
import com.fixmycity_api.issue.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommunityRepository extends JpaRepository<Issue, Long> {

    @Query("""
        SELECT new com.fixmycity_api.community.dto.ContributorDTO(
            i.user.fullName,
            COUNT(i)
        )
        FROM Issue i
        GROUP BY i.user.fullName
        ORDER BY COUNT(i) DESC
        """)
    List<ContributorDTO> getTopContributors();

    @Query("""
        SELECT new com.fixmycity_api.community.dto.CommunityIssueDTO(
            i.id,
            i.title,
            i.category,
            i.location
        )
        FROM Issue i
        WHERE i.status='Resolved'
        ORDER BY i.resolvedAt DESC
        """)
    List<CommunityIssueDTO> getLatestResolvedIssues();

    @Query("SELECT COUNT(i) FROM Issue i")
    long totalIssues();

    @Query("SELECT COUNT(i) FROM Issue i WHERE i.status='Reported'")
    long reportedIssues();

    @Query("SELECT COUNT(i) FROM Issue i WHERE i.status='In Progress'")
    long inProgressIssues();

    @Query("SELECT COUNT(i) FROM Issue i WHERE i.status='Resolved'")
    long resolvedIssues();
}