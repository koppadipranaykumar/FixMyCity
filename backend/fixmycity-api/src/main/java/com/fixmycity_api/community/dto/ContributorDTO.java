package com.fixmycity_api.community.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ContributorDTO {

    private String name;
    private long reports;

}