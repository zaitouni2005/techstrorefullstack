package com.estore.customer.service;

import com.estore.config.JwtUtils;
import com.estore.customer.dto.AuthRequest;
import com.estore.customer.dto.AuthResponse;
import com.estore.customer.dto.ChangePasswordRequest;
import com.estore.customer.dto.RegisterRequest;
import com.estore.customer.entity.Profile;
import com.estore.customer.entity.Role;
import com.estore.customer.entity.User;
import com.estore.customer.repository.RoleRepository;
import com.estore.customer.repository.UserRepository;
import com.estore.exception.BadRequestException;
import com.estore.shopping.entity.Cart;
import com.estore.shopping.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    public AuthResponse authenticateUser(AuthRequest loginRequest) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        } catch (BadCredentialsException e) {
            throw new BadRequestException("Email ou mot de passe incorrect");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadRequestException("Email ou mot de passe incorrect"));

        String role = user.getRole() != null ? user.getRole().getName().replace("ROLE_", "").toLowerCase() : "user";
        String name = user.getProfile() != null
                ? user.getProfile().getFirstName() + " " + user.getProfile().getLastName()
                : user.getEmail();

        return AuthResponse.builder()
                .token(jwt)
                .role(role)
                .user(AuthResponse.UserInfo.builder()
                        .id(user.getId())
                        .name(name.trim())
                        .email(user.getEmail())
                        .build())
                .build();
    }

    @Transactional
    public AuthResponse registerUser(RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Cet email est déjà utilisé");
        }

        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        user.setRole(userRole);

        String firstName = "";
        String lastName = "";
        if (signUpRequest.getName() != null) {
            String[] parts = signUpRequest.getName().trim().split(" ", 2);
            firstName = parts[0];
            lastName = parts.length > 1 ? parts[1] : "";
        }

        Profile profile = new Profile();
        profile.setFirstName(firstName);
        profile.setLastName(lastName);
        profile.setUser(user);
        user.setProfile(profile);

        userRepository.save(user);

        Cart cart = new Cart();
        cart.setUser(user);
        cartRepository.save(cart);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        String jwt = jwtUtils.generateJwtToken(authentication);

        return AuthResponse.builder()
                .token(jwt)
                .role("user")
                .user(AuthResponse.UserInfo.builder()
                        .id(user.getId())
                        .name(signUpRequest.getName() != null ? signUpRequest.getName() : user.getEmail())
                        .email(user.getEmail())
                        .build())
                .build();
    }

    public AuthResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        String role = user.getRole() != null ? user.getRole().getName().replace("ROLE_", "").toLowerCase() : "user";
        String name = user.getProfile() != null
                ? user.getProfile().getFirstName() + " " + user.getProfile().getLastName()
                : user.getEmail();

        return AuthResponse.builder()
                .role(role)
                .user(AuthResponse.UserInfo.builder()
                        .id(user.getId())
                        .name(name.trim())
                        .email(user.getEmail())
                        .build())
                .build();
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (!encoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
