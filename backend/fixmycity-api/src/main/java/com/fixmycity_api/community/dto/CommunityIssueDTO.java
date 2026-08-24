package com.fixmycity_api.community.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CommunityIssueDTO {

    private Long id;
    private String title;
    private String category;
    private String location;

}