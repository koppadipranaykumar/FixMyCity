package com.fixmycity_api.issue;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class IssueService {

    private final IssueRepository issueRepository;

    public IssueService(IssueRepository issueRepository) {
        this.issueRepository = issueRepository;
    }

    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

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

            // Store only filename for now
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

        issue.setStatus("REPORTED");

        issueRepository.save(issue);

        return "Issue Submitted Successfully";
    }
}