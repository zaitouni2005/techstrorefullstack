package com.estore.customer.controller;

import com.estore.customer.entity.Profile;
import com.estore.customer.entity.User;
import com.estore.customer.repository.ProfileRepository;
import com.estore.customer.repository.UserRepository;
import com.estore.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Tag(name = "User Profile", description = "Endpoints for managing the authenticated user's personal details")
public class ProfileController {
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    @GetMapping
    @Operation(summary = "Get current profile", description = "Retrieve the personal details (address, phone, etc.) of the authenticated user")
    public Profile getProfile(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return user.getProfile();
    }

    @PutMapping
    @Operation(summary = "Update profile", description = "Modify the personal details of the authenticated user")
    public Profile updateProfile(@RequestBody Profile profileRequest, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Profile profile = user.getProfile();
        profile.setFirstName(profileRequest.getFirstName());
        profile.setLastName(profileRequest.getLastName());
        profile.setPhone(profileRequest.getPhone());
        profile.setAddress(profileRequest.getAddress());
        profile.setCity(profileRequest.getCity());
        profile.setCountry(profileRequest.getCountry());

        return profileRepository.save(profile);
    }
}
