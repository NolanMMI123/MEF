package com.monespaceformation.backend.controller;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
// On autorise React à parler au Backend
@CrossOrigin(originPatterns = {"http://localhost:5173", "https://*.vercel.app"})
public class PaymentController {

    // Ta clé secrète de TEST (Celle qui commence par sk_test)
    // J'ai remis celle que tu m'as donnée
    private String stripeApiKey = "sk_test_51SpFTID5WWksLHsg25av61INY9a0m7F2Co7AjNQx4G1FvBRsjjghXyuOxa5TPtVoo5SecfkAADNEV78N2saDaQfv002bppOWKg";

    @PostMapping("/create-intent")
    public Map<String, String> createPaymentIntent(@RequestBody Map<String, Object> data) throws StripeException {
        Stripe.apiKey = stripeApiKey;

        // On prépare une transaction de 2490.00€ (chiffre en centimes)
        PaymentIntentCreateParams params =
            PaymentIntentCreateParams.builder()
                .setAmount(249000L) 
                .setCurrency("eur")
                .setAutomaticPaymentMethods(
                    PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                        .setEnabled(true)
                        .build()
                )
                .build();

        PaymentIntent intent = PaymentIntent.create(params);

        Map<String, String> response = new HashMap<>();
        response.put("clientSecret", intent.getClientSecret());

        return response;
    }
}