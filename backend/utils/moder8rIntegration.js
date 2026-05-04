import axios from "axios";

/**
 * Moderate content using Moder8r.app
 * @param {string} text - Text content to moderate
 * @returns {Promise<{flagged: boolean, categories: Array, rating: string, error: boolean}>}
 */
export const moderateContent = async (text) => {
  try {
    const apiKey = process.env.MODER8R_API_KEY;

    if (!apiKey) {
      console.error("❌ MODER8R_API_KEY not found in .env");
      return { flagged: false, error: true };
    }

    // Moder8r.app API endpoint
    const response = await axios.post(
      "https://api.moder8r.app/v1/moderate",
      {
        content: text,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      }
    );

    const result = response.data;

    // Extract scores from API response
    const categories = result.categories || {};
    const violence = categories.violence?.score || 0;
    const selfHarm = categories.self_harm?.score || 0;
    const harassment = categories.harassment?.score || 0;
    const hate = categories.hate?.score || 0;
    const profanity = categories.profanity?.score || 0;
    const toxicityScore = categories.toxicity?.score || 0;

    // ✅ CUSTOM THRESHOLD LOGIC (instead of trusting API's action)
    let shouldBlock = false;
    let blockReason = [];

    // TIER 1: CRITICAL - Zero tolerance for serious threats
    if (violence > 0.85) {
      shouldBlock = true;
      blockReason.push("violence");
    }

    if (selfHarm > 0.8) {
      shouldBlock = true;
      blockReason.push("self-harm");
    }

     // TOXICITY TIER
    if (toxicityScore > 0.95) {
      shouldBlock = true;
      blockReason.push("toxicity");
    }

    // TIER 2: SEVERE - Only extreme harassment/hate
    if (harassment > 0.95) {
      shouldBlock = true;
      blockReason.push("harassment");
    }

    // TIER 3:If high harassment + profanity together
    if (harassment > 0.90 && toxicityScore > 0.90) {
      shouldBlock = true;
      blockReason.push("harassment");
    }

   

    if (hate > 0.9) {
      shouldBlock = true;
      blockReason.push("hate speech");
    }

    // Log only blocked content for security monitoring
    if (shouldBlock) {
      console.log("🚫 Content BLOCKED:", blockReason.join(", "));
    }

    blockReason = [...new Set(blockReason)];

    return {
      flagged: shouldBlock,
      categories: blockReason,
      scores: {
        violence,
        selfHarm,
        harassment,
        hate,
        profanity,
      },
      rating: result.rating || "G",
      error: false,
    };
  } catch (error) {
    console.error("❌ Moder8r Error:", error.response?.data || error.message);

    // Fail-open: Allow content if API fails
    return {
      flagged: false,
      error: true,
      errorMessage: error.message,
    };
  }
};
