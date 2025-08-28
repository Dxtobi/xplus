import { toast } from 'svelte-sonner';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import axios from 'axios'; // Import Axios
import { PUBLIC_BASE_URL } from '$env/static/public';

class ApiService {
  constructor() {
    this.baseURL = `${PUBLIC_BASE_URL}/api`;
    this.token = null;
  }

  /**
   * Sets the authentication token for subsequent requests.
   * Call this after the user logs in.
   * @param {string} token - The JWT token.
   */
  setAuthToken(token) {
    this.token = token;
  }

  /**
   * Clears the authentication token.
   * Call this when the user logs out.
   */
  clearAuthToken() {
    this.token = null;
  }

  /**
   * A private helper method to handle all API requests using Axios.
   * @param {string} endpoint - The API endpoint (e.g., '/user/profile').
   * @param {string} method - The HTTP method (GET, POST, PUT, DELETE).
   * @param {object} [options] - Optional settings { body, params }.
   * @returns {Promise<{data: any, error: any}>} - A structured response.
   */
  async #request(endpoint, method, options = {}) {
    const { body, params } = options;
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json'
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      method,
      url,
      headers,
    };

    if (body) {
      config.data = body; // Axios uses 'data' instead of 'body'
    }

    if (params) {
      config.params = params; // Axios uses 'params' for query parameters
    }

    try {
      const response = await axios(config);

      return { data: response.data, error: null }; // Return data on success

    } catch (error) {
      if (axios.isCancel(error)) {
          // Request was cancelled, e.g., by a timeout.
          console.warn('Request cancelled:', error.message);
          return { data: null, error: { status: 0, message: 'Request cancelled.' } }; // Or your preferred error handling
      }

      // Handle network errors and Axios-specific error details.
      const status = error.response?.status || error.code === 'ECONNABORTED' ? 503 : error.response?.status || 0; // Use 0 for network errors
      const message = error.response?.data?.message || error.message || 'An unexpected error occurred.';
      console.error('Axios Error:', error.message);
      // SvelteKit throws a redirect on 401/403 in hooks, but this handles API errors gracefully
      if (status === 401) {
           this.clearAuthToken();
           // Optionally redirect to login
           const { route } = get(page);
           if (route.id !== '/login') {
             window.location.href = '/login';
           }
        }
      return { data: null, error: { status, message } };
    }
  }

  /**
   * Processes the API response and shows toast notifications.
   * @param {Promise<{data: any, error: any}>} requestPromise - The promise returned by #request.
   * @param {object} [messages] - Optional custom messages for toasts.
   * @param {string} [messages.successMsg] - Message on success. If omitted, no success toast is shown.
   * @returns {Promise<any>} - Returns the data on success, or throws the error on failure.
   */
  async #handleResponse(requestPromise, messages = {}) {
    const { data, error } = await requestPromise;

    if (error) {
      console.error('API Error:', error.message);
      toast.error(error.message || 'Something went wrong.');
      // throw new Error(error.message); // Throw error to be caught by the calling function if needed
      return null
    }

    if (messages.successMsg) {
      toast.success(messages.successMsg);
    }

    return data;
  }

  // --- USER ROUTES ---
  getUserProfile() {
    const request = this.#request('/user/profile', 'GET');
    return this.#handleResponse(request);
  }

  updateUserProfile(profileData) {
    const request = this.#request('/user/profile', 'PUT', { body: profileData });
    return this.#handleResponse(request, { successMsg: 'Profile updated successfully!' });
  }

  getUserAnalytics() {
    const request = this.#request('/user/analytics', 'GET');
    return this.#handleResponse(request);
  }

  // --- CAMPAIGN ROUTES ---
  createCampaign(campaignData) {
    const request = this.#request('/campaigns', 'POST', { body: campaignData });
    return this.#handleResponse(request, { successMsg: 'Campaign created!' });
  }

  getUserCampaigns(params) { // { page, limit, status }
    const request = this.#request('/campaigns', 'GET', { params });
    return this.#handleResponse(request);
  }

  /**
 * Fetches available campaigns with optional filtering and pagination.
 *
 * @param {Object} params - Query parameters for filtering and pagination.
 * @param {number} [params.page=1] - The page number for pagination (default: 1).
 * @param {number} [params.limit=20] - The number of items per page (default: 20).
 * @param {string} [params.platform] - Filter campaigns by platform (e.g., 'instagram', 'twitter').
 * @param {string} [params.actionType] - Filter campaigns by action type (e.g., 'like', 'follow').
 * @param {string} [params.category] - Filter campaigns by category (e.g., 'fashion', 'tech').
 * @returns {Promise<any>} - Resolves with the list of available campaigns.
 */
  getAvailableCampaigns(params) { // { page, limit, platform, ... }
    const request = this.#request('/campaigns/available', 'GET', { params });
    return this.#handleResponse(request);
  }

  deleteCampaign(campaignId) {
    const request = this.#request(`/campaigns/${campaignId}`, 'DELETE');
    return this.#handleResponse(request, { successMsg: 'Campaign deleted and refunded.' });
  }

  // --- ENGAGEMENT ROUTES ---
  engageWithCampaign(campaignId, data) {
    const request = this.#request(`/campaigns/${campaignId}/engage`, 'POST', { body: data });
    return this.#handleResponse(request, { successMsg: 'Proof submitted! Awaiting creator review.' });
    
  }

  // --- PAYMENT ROUTES ---
  initiateDeposit(depositData) { // { amount, paymentMethod }
    const request = this.#request('/payments/deposit', 'POST', { body: depositData });
    return this.#handleResponse(request, { successMsg: 'Redirecting to payment gateway...' });
  }

  addPaystackRecipient(userData){
    const request = this.#request('/payouts/add-recipient', 'POST', { body: userData });
    return this.#handleResponse(request, { successMsg: 'Account added' });
  }

  initiateWithdrawal(userData){
    const request = this.#request('/payouts/initiate-withdrawal', 'POST', { body: userData });
    return this.#handleResponse(request, { successMsg: 'Account added' });
  }

  submitEngagementProof(formData){
    const request = this.#request('/payouts/initiate-withdrawal', 'POST', { body: formData });
    return this.#handleResponse(request, { successMsg: 'Account added' });
  }

}

// Export a singleton instance
export const api = new ApiService();