package com.fixmycity_api.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminLoginRequest {

    private String email;

    private String password;
}