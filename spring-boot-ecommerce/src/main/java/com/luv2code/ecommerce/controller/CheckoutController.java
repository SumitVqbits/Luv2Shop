package com.luv2code.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.luv2code.ecommerce.dto.PaymentInfo;
import com.luv2code.ecommerce.dto.Purchase;
import com.luv2code.ecommerce.dto.PurchaseResponse;
import com.luv2code.ecommerce.service.CheckoutService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

import java.io.FileWriter;
import java.nio.file.Path;
import java.util.logging.Logger;


@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private Logger logger = Logger.getLogger(getClass().getName());

    private CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {

        // #region agent log
        try (FileWriter fw = new FileWriter(Path.of("..", "debug-efdfc7.log").toFile(), true)) {
            fw.write("{\"sessionId\":\"efdfc7\",\"runId\":\"pre-fix\",\"hypothesisId\":\"H2\",\"location\":\"CheckoutController.java:placeOrder\",\"message\":\"/checkout/purchase called\",\"data\":{\"hasOrder\":"
                    + (purchase != null && purchase.getOrder() != null)
                    + ",\"hasItems\":"
                    + (purchase != null && purchase.getOrderItems() != null)
                    + ",\"itemsCount\":"
                    + (purchase != null && purchase.getOrderItems() != null ? purchase.getOrderItems().size() : -1)
                    + "},\"timestamp\":"
                    + System.currentTimeMillis()
                    + "}\n");
        } catch (Exception ignored) {}
        // #endregion

        PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);

        // #region agent log
        try (FileWriter fw = new FileWriter(Path.of("..", "debug-efdfc7.log").toFile(), true)) {
            fw.write("{\"sessionId\":\"efdfc7\",\"runId\":\"pre-fix\",\"hypothesisId\":\"H2\",\"location\":\"CheckoutController.java:placeOrder\",\"message\":\"/checkout/purchase response\",\"data\":{\"hasTrackingNumber\":"
                    + (purchaseResponse != null && purchaseResponse.getOrderTrackingNumber() != null && !purchaseResponse.getOrderTrackingNumber().isBlank())
                    + "},\"timestamp\":"
                    + System.currentTimeMillis()
                    + "}\n");
        } catch (Exception ignored) {}
        // #endregion

        return purchaseResponse;
    }

    @PostMapping("/payment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfo paymentInfo) throws StripeException {

        logger.info("paymentInfo.amount: " + paymentInfo.getAmount());

        // #region agent log
        try (FileWriter fw = new FileWriter(Path.of("..", "debug-efdfc7.log").toFile(), true)) {
            fw.write("{\"sessionId\":\"efdfc7\",\"runId\":\"pre-fix\",\"hypothesisId\":\"H1\",\"location\":\"CheckoutController.java:createPaymentIntent\",\"message\":\"/checkout/payment-intent called\",\"data\":{\"amount\":"
                    + paymentInfo.getAmount()
                    + ",\"hasCurrency\":"
                    + (paymentInfo.getCurrency() != null && !paymentInfo.getCurrency().isBlank())
                    + "},\"timestamp\":"
                    + System.currentTimeMillis()
                    + "}\n");
        } catch (Exception ignored) {}
        // #endregion
        
        PaymentIntent paymentIntent;
        try {
            paymentIntent = checkoutService.createPaymentIntent(paymentInfo);
        } catch (StripeException se) {
            // #region agent log
            try (FileWriter fw = new FileWriter(Path.of("..", "debug-efdfc7.log").toFile(), true)) {
                fw.write("{\"sessionId\":\"efdfc7\",\"runId\":\"pre-fix\",\"hypothesisId\":\"H1\",\"location\":\"CheckoutController.java:createPaymentIntent\",\"message\":\"/checkout/payment-intent StripeException\",\"data\":{\"type\":\""
                        + (se.getClass().getSimpleName())
                        + "\",\"hasMessage\":"
                        + (se.getMessage() != null && !se.getMessage().isBlank())
                        + "},\"timestamp\":"
                        + System.currentTimeMillis()
                        + "}\n");
            } catch (Exception ignored) {}
            // #endregion
            throw se;
        }

        String paymentStr = paymentIntent.toJson();

        // #region agent log
        try (FileWriter fw = new FileWriter(Path.of("..", "debug-efdfc7.log").toFile(), true)) {
            fw.write("{\"sessionId\":\"efdfc7\",\"runId\":\"pre-fix\",\"hypothesisId\":\"H1\",\"location\":\"CheckoutController.java:createPaymentIntent\",\"message\":\"/checkout/payment-intent success\",\"data\":{\"hasPaymentIntent\":"
                    + (paymentIntent != null)
                    + ",\"jsonLength\":"
                    + (paymentStr != null ? paymentStr.length() : -1)
                    + "},\"timestamp\":"
                    + System.currentTimeMillis()
                    + "}\n");
        } catch (Exception ignored) {}
        // #endregion

        return new ResponseEntity<>(paymentStr, HttpStatus.OK);
        
    }

}
