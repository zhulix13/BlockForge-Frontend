import axios from "axios";

/**
 * Parses an error object (usually from Axios) and returns a human-friendly message.
 * Hides technical details like status codes unless specifically needed for debugging.
 */
export function getFriendlyErrorMessage(error: any): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    // 1. If the server provided a specific message, use it if it looks friendly
    if (message && typeof message === "string" && message.length < 100) {
      return message;
    }

    // 2. Map common status codes to friendly messages
    switch (status) {
      case 400:
        return "The request was invalid. Please check your input.";
      case 401:
        return "Session expired. Please log in again.";
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 409:
        return "You have already submitted for this task.";
      case 413:
        return "The file is too large. Maximum size is 5MB.";
      case 429:
        return "Too many requests. Please slow down.";
      case 500:
      case 502:
      case 503:
      case 504:
        return "Our servers are having a moment. Please try again in a few minutes.";
      default:
        // Handle network errors (no response)
        if (!error.response) {
          return "Network error. Please check your internet connection.";
        }
        return "Something went wrong. Please try again later.";
    }
  }

  // Fallback for non-Axios errors
  return error?.message || "An unexpected error occurred.";
}
