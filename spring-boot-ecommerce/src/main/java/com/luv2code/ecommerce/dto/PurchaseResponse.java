package com.luv2code.ecommerce.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseResponse {

    @JsonProperty("orderTrackingNumber")

    private String orderTrackingNumber;


}
        
        
     
    
