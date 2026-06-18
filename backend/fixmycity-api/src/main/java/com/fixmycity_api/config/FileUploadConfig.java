package com.fixmycity_api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;

@Configuration
public class FileUploadConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path rootPath;
        
        // Dynamically choose path: if running on Replit (where frontend is two steps up), step out. 
        // Otherwise, use the standard local project directory path for Eclipse.
        if (Files.exists(Paths.get("../../frontend"))) {
            rootPath = Paths.get("../../uploads").toAbsolutePath().normalize();
        } else {
            rootPath = Paths.get("uploads").toAbsolutePath().normalize();
        }
        
        String uploadPath = rootPath.toUri().toString();
        
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath);
    }
}