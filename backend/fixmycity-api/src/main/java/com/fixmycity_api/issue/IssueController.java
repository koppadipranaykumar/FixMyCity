package com.fixmycity_api.issue;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fixmycity_api.issue.dto.AssignWorkerRequest;
import com.fixmycity_api.issue.dto.IssueListDTO;
import com.fixmycity_api.issue.dto.ResolveIssueRequest;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "*")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    // CREATE ISSUE

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public String createIssue(

            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam String location,
            @RequestParam String userEmail,
            @RequestParam(required = false)
            Double latitude,

            @RequestParam(required = false)
            Double longitude,

            @RequestParam(required = false)
            MultipartFile image,
            @RequestParam String reportedBy

    ) throws Exception {

        return issueService.createIssue(
                title,
                description,
                category,
                location,
                userEmail,
                latitude,
                longitude,
                image,
                reportedBy
        );
    }
    @PutMapping(
            value = "/{id}/resolve-with-proof",
            consumes =
                    MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Issue resolveIssueWithProof(

            @PathVariable Long id,

            @RequestParam String resolutionNote,

            @RequestParam(
                    required = false
            )
            MultipartFile proofImage

    ) throws Exception {

        return issueService
                .resolveIssueWithProof(
                        id,
                        resolutionNote,
                        proofImage
                );
    }

    // GET ALL ISSUES (lightweight — no images)

    @GetMapping
    public List<IssueListDTO> getAllIssues() {
        return issueService.getAllIssues();
    }

    // GET SINGLE ISSUE (full — includes images)

    @GetMapping("/{id}")
    public Issue getIssueById(@PathVariable Long id) {
        return issueService.getIssueById(id);
    }

    @GetMapping("/my-reports/{email}")
    public List<IssueListDTO> getMyReports(@PathVariable String email) {
        return issueService.getIssuesByUser(email);
    }
    // ASSIGN WORKER

    @PutMapping("/{id}/assign")
    public Issue assignWorker(

            @PathVariable Long id,

            @RequestBody
            AssignWorkerRequest request

    ) {

        return issueService.assignWorker(
                id,
                request.getWorkerName()
        );
    }

    // RESOLVE ISSUE

    @PutMapping("/{id}/resolve")
    public Issue resolveIssue(

            @PathVariable Long id,

            @RequestBody
            ResolveIssueRequest request

    ) {

        return issueService.resolveIssue(
                id,
                request.getResolutionNote(),
                null
        );
    }

    // DELETE ISSUE

    @DeleteMapping("/{id}")
    public void deleteIssue(
            @PathVariable Long id
    ) {

        issueService.deleteIssue(id);
    }
}