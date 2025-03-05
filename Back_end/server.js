const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const GODADDY_API_KEY = "our_API_key";
const GODADDY_API_SECRET = "our_API_secret";
const GODADDY_BASE_URL = "https://api.ote-godaddy.com/v1/domains/available";

const DYNADOT_API_KEY = "our_API_key";
const DYNADOT_BASE_URL = "https://api.dynadot.com/api3.json";

app.get("/api/price/:domain", async (req, res) => {
  const domain = req.params.domain;
  try {
    // Call both APIs concurrently
    const godaddyPromise = axios.get(GODADDY_BASE_URL, {
      headers: {
        "Authorization": `sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}`,
        "Accept": "application/json"
      },
      params: { domain }
    });

    const dynadotPromise = axios.get(DYNADOT_BASE_URL, {
      params: {
        key: DYNADOT_API_KEY,
        command: "search",
        domain0: domain,
        show_price: 1,
        currency: "USD"
      }
    });

    const [godaddyResponse, dynadotResponse] = await Promise.all([godaddyPromise, dynadotPromise]);

    // For GoDaddy, convert the price if available
    const godaddyPrice = godaddyResponse.data.price
      ? godaddyResponse.data.price / 1000000
      : null;

    // For Dynadot, extract the price from the known structure:
    let dynadotPrice = null;
    const dynadotData = dynadotResponse.data;
    if (
      dynadotData.SearchResponse &&
      dynadotData.SearchResponse.SearchResults &&
      dynadotData.SearchResponse.SearchResults.length > 0
    ) {
      const priceStr = dynadotData.SearchResponse.SearchResults[0].Price;
      // Use regex to extract the registration price value
      const match = priceStr.match(/Registration Price:\s*([\d.]+)/);
      if (match && match[1]) {
        dynadotPrice = parseFloat(match[1]);
      }
    }
    
    res.json({
      domain,
      available: godaddyResponse.data.available,
      price: godaddyPrice,
      dynadotPrice: dynadotPrice
    });
  } catch (error) {
    console.error(
      "Error fetching domain price:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Error fetching domain price" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
