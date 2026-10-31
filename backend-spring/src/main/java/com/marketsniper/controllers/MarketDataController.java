package com.marketsniper.controllers;

import com.marketsniper.dto.response.ApiResponse;
import com.marketsniper.services.MarketDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/market")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MarketDataController {

    private final MarketDataService marketDataService;

    // Constructor Injection (Spring Core IoC)
    public MarketDataController(MarketDataService marketDataService) {
        this.marketDataService = marketDataService;
    }

    /**
     * Get real-time quotes, indices, and market breadth
     * Flow: Postman/React -> REST Controller -> MarketDataService -> Response
     */
    @GetMapping("/live-data")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getLiveMarketData() {
        Map<String, Object> feed = marketDataService.getLiveMarketFeed();
        return ResponseEntity.ok(ApiResponse.success("Live market data feed retrieved", feed));
    }

    /**
     * Get specific symbol quote
     */
    @GetMapping("/quote/{symbol}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getQuote(@PathVariable String symbol) {
        Map<String, Object> quote = marketDataService.getQuoteBySymbol(symbol);
        return ResponseEntity.ok(ApiResponse.success("Symbol quote retrieved", quote));
    }
}
