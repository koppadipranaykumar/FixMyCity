package com.fixmycity_api.issue;

import com.fixmycity_api.user.User;
import com.fixmycity_api.user.UserRepository;
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
    private final UserRepository userRepository;

    // Dynamically choose path: steps out on Replit workspace structures, falls back to standard execution path locally
    private final Path globalUploadPath = Files.exists(Paths.get("../../frontend")) ?
            Paths.get("../../uploads").toAbsolutePath().normalize() :
            Paths.get("uploads").toAbsolutePath().normalize();

    public IssueService(IssueRepository issueRepository, UserRepository userRepository) {
        this.issueRepository = issueRepository;
        this.userRepository = userRepository;
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
            String userEmail,
            Double latitude,
            Double longitude,
            MultipartFile image,
            String reportedBy
    ) throws Exception {

        String imageUrl = null;

        if (image != null && !image.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();

            // Create global uploads folder if it doesn't exist
            Files.createDirectories(globalUploadPath);

            // Save file inside global uploads directory
            Files.copy(
                    image.getInputStream(),
                    globalUploadPath.resolve(fileName),
                    StandardCopyOption.REPLACE_EXISTING
            );

            imageUrl = fileName;
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        Issue issue = new Issue();
        issue.setTitle(title);
        issue.setDescription(description);
        issue.setCategory(category);
        issue.setLocation(location);
        issue.setUser(user);
        issue.setLatitude(latitude);
        issue.setLongitude(longitude);
        issue.setImageUrl(imageUrl);
        issue.setReportedBy(reportedBy);
        issue.setStatus("Reported");
        issue.setReportedAt(LocalDateTime.now());

        issueRepository.save(issue);
        return "Issue Submitted Successfully";
    }

    // ASSIGN WORKER
    public Issue assignWorker(Long issueId, String workerName) {
        Issue issue = issueRepository.findById(issueId).orElseThrow();
        issue.setAssignedWorker(workerName);
        issue.setStatus("In Progress");
        return issueRepository.save(issue);
    }

    // RESOLVE ISSUE
    public Issue resolveIssue(Long issueId, String note, String proofImage) {
        Issue issue = issueRepository.findById(issueId).orElseThrow();
        issue.setStatus("Resolved");
        issue.setResolutionNote(note);
        issue.setProofImage(proofImage);
        issue.setResolvedAt(LocalDateTime.now());
        return issueRepository.save(issue);
    }

    // RESOLVE ISSUE WITH PROOF
    public Issue resolveIssueWithProof(
            Long issueId,
            String note,
            MultipartFile proofImage
    ) throws Exception {

        Issue issue = issueRepository.findById(issueId).orElseThrow();
        String fileName = null;

        if (proofImage != null && !proofImage.isEmpty()) {
            fileName = System.currentTimeMillis() + "_" + proofImage.getOriginalFilename();

            // Create global uploads folder if it doesn't exist
            Files.createDirectories(globalUploadPath);

            // Save file inside global uploads directory
            Files.copy(
                    proofImage.getInputStream(),
                    globalUploadPath.resolve(fileName),
                    StandardCopyOption.REPLACE_EXISTING
            );
        }

        issue.setStatus("Resolved");
        issue.setResolutionNote(note);
        issue.setProofImage(fileName);
        issue.setResolvedAt(LocalDateTime.now());

        return issueRepository.save(issue);
    }

    // DELETE ISSUE
    public void deleteIssue(Long issueId) {
        issueRepository.deleteById(issueId);
    }

    public List<Issue> getIssuesByUser(String email) {
        return issueRepository.findByReportedBy(email);
    }
}