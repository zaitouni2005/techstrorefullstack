package com.estore.customer.controller;

import com.estore.config.UserHelper;
import com.estore.customer.entity.Profile;
import com.estore.customer.repository.ProfileRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Tag(name = "User Profile", description = "Endpoints for managing the authenticated user's personal details")
public class ProfileController {
    private final UserHelper userHelper;
    private final ProfileRepository profileRepository;

    @GetMapping
    @Operation(summary = "Get current profile", description = "Retrieve the personal details (address, phone, etc.) of the authenticated user")
    public Profile getProfile(Authentication authentication) {
        var user = userHelper.getCurrentUser(authentication);
        return user.getProfile();
    }

    @PutMapping
    @Transactional
    @Operation(summary = "Update profile", description = "Modify the personal details of the authenticated user")
    public Profile updateProfile(@RequestBody Profile profileRequest, Authentication authentication) {
        var user = userHelper.getCurrentUser(authentication);

        Profile profile = user.getProfile();
        if (profile == null) {
            throw new IllegalStateException("Profile not found");
        }
        profile.setFirstName(profileRequest.getFirstName());
        profile.setLastName(profileRequest.getLastName());
        profile.setPhone(profileRequest.getPhone());
        profile.setAddress(profileRequest.getAddress());
        profile.setCity(profileRequest.getCity());
        profile.setCountry(profileRequest.getCountry());

        return profileRepository.save(profile);
    }
}
