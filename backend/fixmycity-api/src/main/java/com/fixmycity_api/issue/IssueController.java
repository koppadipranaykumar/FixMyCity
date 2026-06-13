package com.fixmycity_api.issue;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "http://localhost:5173")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public String createIssue(

            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam String location,

            @RequestParam(required = false)
            Double latitude,

            @RequestParam(required = false)
            Double longitude,

            @RequestParam(required = false)
            MultipartFile image
            

    ) throws Exception {

        return issueService.createIssue(
                title,
                description,
                category,
                location,
                latitude,
                longitude,
                image
        );
    }

    @GetMapping
    public List<Issue> getAllIssues() {
        return issueService.getAllIssues();
    }
}