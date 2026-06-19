package com.fixmycity_api.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping({
        "/admin",
        "/admin/",
        "/admin/{p:[^\\.]*}",
        "/admin/{p1:[^\\.]*}/{p2:[^\\.]*}",
        "/admin/{p1:[^\\.]*}/{p2:[^\\.]*}/{p3:[^\\.]*}"
    })
    public String admin() {
        return "forward:/admin/index.html";
    }

    @GetMapping({
        "/",
        "/{p:[^\\.]*}",
        "/{p1:[^\\.]*}/{p2:[^\\.]*}",
        "/{p1:[^\\.]*}/{p2:[^\\.]*}/{p3:[^\\.]*}"
    })
    public String citizen() {
        return "forward:/index.html";
    }
}
