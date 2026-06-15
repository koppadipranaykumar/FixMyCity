package com.fixmycity_api.issue;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class IssueService {

    private final IssueRepository issueRepository;

    public IssueService(IssueRepository issueRepository) {
        this.issueRepository = issueRepository;
    }

    // GET ALL ISSUES

    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    // CREATE ISSUE

    public String createIssue(
            String title,
            String description,
            String category,
            String location,
            Double latitude,
            Double longitude,
            MultipartFile image
    ) throws Exception {

        String imageUrl = null;

        if (image != null && !image.isEmpty()) {

            String fileName =
                    System.currentTimeMillis()
                            + "_"
                            + image.getOriginalFilename();

            Path uploadPath = Paths.get(
                    "C:\\Users\\Pranay Kumar\\Desktop\\FixMyCity\\backend\\fixmycity-api\\uploads"
            );

            Files.createDirectories(uploadPath);

            Files.copy(
                    image.getInputStream(),
                    uploadPath.resolve(fileName),
                    StandardCopyOption.REPLACE_EXISTING
            );

            imageUrl = fileName;
        }

        Issue issue = new Issue();

        issue.setTitle(title);
        issue.setDescription(description);
        issue.setCategory(category);
        issue.setLocation(location);

        issue.setLatitude(latitude);
        issue.setLongitude(longitude);

        issue.setImageUrl(imageUrl);

        issue.setStatus("Reported");

        issue.setReportedAt(
                LocalDateTime.now()
        );

        issueRepository.save(issue);

        return "Issue Submitted Successfully";
    }

    // ASSIGN WORKER

    public Issue assignWorker(
            Long issueId,
            String workerName
    ) {

        Issue issue = issueRepository
                .findById(issueId)
                .orElseThrow();

        issue.setAssignedWorker(workerName);

        issue.setStatus("In Progress");

        return issueRepository.save(issue);
    }

    // RESOLVE ISSUE

    public Issue resolveIssue(
            Long issueId,
            String note,
            String proofImage
    ) {

        Issue issue = issueRepository
                .findById(issueId)
                .orElseThrow();

        issue.setStatus("Resolved");

        issue.setResolutionNote(note);

        issue.setProofImage(proofImage);

        issue.setResolvedAt(
                LocalDateTime.now()
        );

        return issueRepository.save(issue);
    }
    public Issue resolveIssueWithProof(
            Long issueId,
            String note,
            MultipartFile proofImage
    ) throws Exception {

        Issue issue = issueRepository
                .findById(issueId)
                .orElseThrow();

        String fileName = null;

        if (
            proofImage != null &&
            !proofImage.isEmpty()
        ) {

            fileName =
                    System.currentTimeMillis()
                    + "_"
                    + proofImage.getOriginalFilename();

            Path uploadPath =
                    Paths.get(
                            "C:\\Users\\Pranay Kumar\\Desktop\\FixMyCity\\backend\\fixmycity-api\\uploads"
                    );

            Files.createDirectories(
                    uploadPath
            );

            Files.copy(
                    proofImage.getInputStream(),
                    uploadPath.resolve(fileName),
                    StandardCopyOption.REPLACE_EXISTING
            );
        }

        issue.setStatus("Resolved");

        issue.setResolutionNote(note);

        issue.setProofImage(fileName);

        issue.setResolvedAt(
                LocalDateTime.now()
        );

        return issueRepository.save(issue);
    }
    // DELETE ISSUE

    public void deleteIssue(
            Long issueId
    ) {

        issueRepository.deleteById(issueId);
    }
}