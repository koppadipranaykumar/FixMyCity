package com.fixmycity_api.issue.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IssueRequest {

    private String title;
    private String description;
    private String category;
    private String location;
    private String imageUrl;
    private Double latitude;
    private Double longitude;
}