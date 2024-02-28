package com.sudhakar.recipe.service.implementation;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.sudhakar.recipe.entity.Booking;
import com.sudhakar.recipe.service.RazorpayService;

@Service
@PropertySource("classpath:application.properties")
public class RazorpayServiceImplementation implements RazorpayService {

    @Value("${razorpay.api.key}")
    private String apiKey;

    @Value("${razorpay.api.secret}")
    private String apiSecret;

    @Value("${razorpay.currency}")
    private String currency;

    @Value("${razorpay.company.name}")
    private String company;

    @Override
    @Transactional
    public ResponseEntity<Booking> createOrder(int amount) {
        try {
            RazorpayClient razorpayClient = new RazorpayClient(apiKey, apiSecret);

            JSONObject orderRequest = new JSONObject();

            orderRequest.put("amount", amount * 100);
            orderRequest.put("currency", currency);
            orderRequest.put("receipt", "order_rcptid_" + System.currentTimeMillis());
            orderRequest.put("payment_capture", 1);
            Order order = razorpayClient.orders.create(orderRequest);
            return new ResponseEntity<>(prepareTransactionDetails(order), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    private Booking prepareTransactionDetails(Order order) {
        String orderId = order.get("id");
        int amount = order.get("amount");
        String currency = order.get("currency");

        System.out.println(apiKey);
        Booking transactionalDetails = new Booking(orderId, currency, amount, apiKey);
        System.out.println(transactionalDetails);
        return transactionalDetails;
    }
}
