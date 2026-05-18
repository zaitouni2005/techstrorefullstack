package com.estore.billing.controller;

import com.estore.shared.dto.ShippingOption;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shipping")
public class ShippingController {

    @PostMapping("/calculate")
    public List<ShippingOption> calculateShipping(@RequestBody(required = false) Map<String, Object> request) {
        return Arrays.asList(
                new ShippingOption("Colissimo", "Standard", 4.99, "3-5 days"),
                new ShippingOption("Colissimo", "Express", 9.99, "1-2 days"),
                new ShippingOption("Chronopost", "Relais", 3.49, "3-5 days"),
                new ShippingOption("Mondial Relay", "Point Relais", 2.99, "4-6 days"));
    }
}
