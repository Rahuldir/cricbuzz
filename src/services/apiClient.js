/**
 * Production-ready API Client with Request & Response Interceptors
 * Base URL: https://dsquaretech.com/v1/cricket
 */

const DEFAULT_BASE_URL = 'https://dsquaretech.com/v1/cricket';
const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production');

class ApiClient {
  constructor(baseUrl = DEFAULT_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    this.requestInterceptors = [];
    this.responseInterceptors = [];
    this.timeoutMs = 8000;

    // Register default logging & validation interceptors
    this.initDefaultInterceptors();
  }

  setBaseUrl(url) {
    let clean = (url || DEFAULT_BASE_URL).trim().replace(/\/+$/, '');
    if (clean.includes('dsquaretech.com') && clean.startsWith('http://')) {
      clean = clean.replace('http://', 'https://');
    }
    this.baseUrl = clean;
    console.log(`[API Client] Base URL set to: ${this.baseUrl}`);
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  // Interceptor registration
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  initDefaultInterceptors() {
    // 1. Request Interceptor: cleans endpoint, adds headers, timestamps
    this.addRequestInterceptor(async (config) => {
      const cleanEndpoint = config.endpoint.replace(/^\/+/, '');
      const fullUrl = `${this.baseUrl}/${cleanEndpoint}`;

      const enrichedConfig = {
        ...config,
        url: fullUrl,
        headers: {
          ...this.defaultHeaders,
          ...(config.headers || {}),
        },
        startTime: Date.now(),
      };

      if (isDev) {
        console.log(`[API Request] 🛫 ${enrichedConfig.method} ${enrichedConfig.url}`, {
          body: enrichedConfig.body,
        });
      }

      return enrichedConfig;
    });

    // 2. Response Interceptor: parses JSON, checks status: false, measures latency
    this.addResponseInterceptor(async (response, config) => {
      const duration = Date.now() - (config.startTime || Date.now());
      const text = await response.text();

      let json;
      try {
        json = JSON.parse(text);
      } catch {
        json = null;
      }

      if (isDev) {
        console.log(
          `[API Response] 🛬 ${response.status} ${config.url} (${duration}ms)`,
          json ? { status: json.status, message: json.message } : text.slice(0, 100)
        );
      }

      // Check HTTP error status
      if (!response.ok) {
        const errorMsg = json?.message || json?.error || `HTTP ${response.status}: ${response.statusText}`;
        const err = new Error(errorMsg);
        err.status = response.status;
        err.data = json;
        throw err;
      }

      // Check application-level status flag if present
      if (json && json.status === false) {
        const err = new Error(json.message || json.error || 'Request failed with status false');
        err.status = response.status;
        err.data = json;
        throw err;
      }

      return {
        success: true,
        data: json,
        raw: text,
        status: response.status,
        duration,
      };
    });
  }

  /**
   * Core request executor with timeout and interceptor pipeline
   */
  async request(endpoint, options = {}) {
    let config = {
      endpoint,
      method: options.method || 'POST',
      headers: options.headers || {},
      body: options.body || {},
      timeoutMs: options.timeoutMs || this.timeoutMs,
    };

    // Execute Request Interceptors
    for (const interceptor of this.requestInterceptors) {
      config = await interceptor(config);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.timeoutMs);

    try {
      const fetchOptions = {
        method: config.method,
        headers: config.headers,
        signal: controller.signal,
      };

      if (config.method !== 'GET' && config.method !== 'HEAD') {
        fetchOptions.body = typeof config.body === 'string' ? config.body : JSON.stringify(config.body);
      }

      const rawResponse = await fetch(config.url, fetchOptions);
      clearTimeout(timer);

      // Execute Response Interceptors
      let processedResponse = rawResponse;
      for (const interceptor of this.responseInterceptors) {
        processedResponse = await interceptor(processedResponse, config);
      }

      return processedResponse;
    } catch (err) {
      clearTimeout(timer);

      let formattedError = err;
      if (err.name === 'AbortError') {
        formattedError = new Error(`Request timeout after ${config.timeoutMs}ms: ${config.url}`);
      }

      if (__DEV__) {
        console.warn(`[API Error] ❌ ${config.method} ${config.url}:`, formattedError.message);
      }

      throw formattedError;
    }
  }

  /**
   * Common POST method
   */
  async post(endpoint, body = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body,
    });
  }

  /**
   * Common GET method
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'GET',
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(DEFAULT_BASE_URL);
export default apiClient;
