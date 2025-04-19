/**
 * Sanitizes token data to ensure it can be properly displayed
 * @param {Array|Object} tokenData - Array of token objects or a single token object
 * @returns {Array|Object} - Sanitized token data
 */
export function sanitizeTokenData(tokenData) {
  // Handle array of tokens
  if (Array.isArray(tokenData)) {
    return tokenData.map((token) => sanitizeSingleToken(token));
  }

  // Handle single token
  return sanitizeSingleToken(tokenData);
}

/**
 * Sanitizes a single token object
 * @param {Object} token - Token object to sanitize
 * @returns {Object} - Sanitized token object
 */
function sanitizeSingleToken(token) {
  if (!token) return token;

  // Create a new object to avoid mutating the original
  const sanitized = { ...token };

  // Sanitize name
  if (sanitized.name) {
    sanitized.name = sanitizeString(
      sanitized.name,
      `Token ${sanitized.mint ? sanitized.mint.slice(0, 8) : "Unknown"}`
    );
  }

  // Sanitize symbol
  if (sanitized.symbol) {
    sanitized.symbol = sanitizeString(
      sanitized.symbol,
      sanitized.mint ? sanitized.mint.slice(0, 4).toUpperCase() : "UNKN"
    );
  }

  // Sanitize description
  if (sanitized.description) {
    sanitized.description = sanitizeString(sanitized.description, "");
  }

  // Ensure uri is valid
  if (sanitized.uri && typeof sanitized.uri === "string") {
    try {
      // Check if URI is valid
      new URL(sanitized.uri);
    } catch (e) {
      sanitized.uri = null;
    }
  }

  return sanitized;
}

/**
 * Sanitizes a string to ensure it can be properly displayed
 * @param {string} str - String to sanitize
 * @param {string} fallback - Fallback value if string is invalid
 * @returns {string} - Sanitized string
 */
function sanitizeString(str, fallback) {
  if (!str) return fallback;

  try {
    // Check if string contains problematic characters
    if (/[^\x20-\x7E]/.test(str) || str.includes("�")) {
      // Remove non-printable/invalid characters
      const cleaned = str.replace(/[^\x20-\x7E]/g, "").trim();

      // If cleaning removed everything or almost everything, use fallback
      if (cleaned.length < 2) {
        return fallback;
      }

      return cleaned;
    }

    // For strings with odd character combinations that might be encoding issues
    if (str.includes("wGeh:") || str.startsWith("�")) {
      return fallback;
    }

    return str;
  } catch (e) {
    return fallback;
  }
}

/**
 * Formats a balance with appropriate number of decimal places
 * @param {number} balance - Token balance
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted balance
 */
export function formatTokenBalance(balance, decimals = 9) {
  if (balance === null || balance === undefined) return "0";

  try {
    return Number(balance).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    });
  } catch (e) {
    return "0";
  }
}
