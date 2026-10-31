package com.marketsniper.services;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
public class MarketDataService {

    public Map<String, Object> getLiveMarketFeed() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ACTIVE");
        response.put("timestamp", Instant.now().toString());

        List<Map<String, Object>> indices = Arrays.asList(
                createQuote("NIFTY 50", "NSE", 24340.85, 128.40, 0.53, "BULLISH"),
                createQuote("BANK NIFTY", "NSE", 52180.20, 312.10, 0.60, "BULLISH"),
                createQuote("FIN NIFTY", "NSE", 23910.45, 84.30, 0.35, "NEUTRAL"),
                createQuote("SENSEX", "BSE", 80110.15, 410.60, 0.51, "BULLISH"),
                createQuote("INDIA VIX", "NSE", 14.25, -0.42, -2.86, "COOLING"),
                createQuote("USD/INR", "FOREX", 84.08, 0.02, 0.02, "STABLE"),
                createQuote("CRUDE OIL", "MCX", 5980.00, -45.00, -0.75, "BEARISH"),
                createQuote("GOLD", "MCX", 78450.00, 210.00, 0.27, "BULLISH")
        );

        response.put("indices", indices);

        Map<String, Object> breadth = new HashMap<>();
        breadth.put("advances", 1380);
        breadth.put("declines", 910);
        breadth.put("ratio", 1.51);
        breadth.put("institutionalBias", "ACCUMULATION");
        response.put("marketBreadth", breadth);

        return response;
    }

    public Map<String, Object> getQuoteBySymbol(String symbol) {
        String upper = symbol.toUpperCase().trim();
        return createQuote(upper, "NSE", 2450.00, 25.50, 1.05, "BULLISH");
    }

    private Map<String, Object> createQuote(String symbol, String exchange, double price, double change, double changePct, String signal) {
        Map<String, Object> quote = new HashMap<>();
        quote.put("symbol", symbol);
        quote.put("exchange", exchange);
        quote.put("price", price);
        quote.put("change", change);
        quote.put("changePct", changePct);
        quote.put("signal", signal);
        quote.put("lastUpdated", Instant.now().toString());
        return quote;
    }
}
