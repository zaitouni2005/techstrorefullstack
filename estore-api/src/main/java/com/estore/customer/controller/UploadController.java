package com.estore.customer.controller;

import com.estore.shared.dto.UploadResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    @PostMapping
    public ResponseEntity<UploadResponse> uploadFile(MultipartFile file) {
        String filename = file != null ? file.getOriginalFilename() : "unknown";
        String url = "/uploads/" + UUID.randomUUID() + "_" + filename;
        return ResponseEntity.ok(new UploadResponse(url, filename));
    }
}
