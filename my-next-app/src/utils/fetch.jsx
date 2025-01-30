

/**
 * Utility function to handle API requests.
 * @param {string} endpoint - The API endpoint to call (relative to the base URL).
 * @param {string} method - HTTP method (GET, POST, etc.). Default is 'GET'.
 * @param {object|null} body - The request body (for POST, PUT, etc.). Default is null.
 * @param {object|null} options - Additional options for fetch (e.g., headers, etc.). Default is {}.
 * @returns {Promise<object>} - Returns the JSON response or throws an error.
 */
export const fetchAPI = async (endpoint, method = "GET", data = null) => {
  const host = process.env.NEXT_PUBLIC_HOST_NAME;

  const url = `${host}${endpoint}`;

  const options = {
    method,
    headers: {
      Accept: "application/json",
    },
  };

  if (data) {
    // Check if data is FormData
    if (data instanceof FormData) {
      options.body = data; // FormData does not need Content-Type header
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(data);
    }
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in fetchAPI:", error.message);
    throw error;
  }
};

