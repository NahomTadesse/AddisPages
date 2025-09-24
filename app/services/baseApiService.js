import tokenService from './tokenService';

const navigationService = {
  navigate: (path) => {
    console.log('🚀 Navigating to:', path);
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  }
};

export const setNavigation = (navigate) => {
  navigationService.navigate = navigate;
};

export const BOOKS_API_BASE_URL = 'https://books-api.addispages.com/api/v1';

export const createAuthenticatedFetch = () => {
  return async (url, options = {}) => {
    console.log('🌐 Starting authenticated fetch to:', url);
    
    let token = await tokenService.getValidToken();
    console.log('🔑 Token status:', token ? 'Valid token found' : 'No valid token');
    
    if (!token) {
      console.log('❌ No valid token, redirecting to login');
      tokenService.clearAuthData();
      navigationService.navigate('/');
      throw new Error('No valid token available');
    }

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Authorization', `Bearer ${token}`);
    console.log('📋 Headers prepared with Bearer token');

    // Handle Content-Type for requests with body
    const optionHeaders = options.headers ? new Headers(options.headers) : new Headers();
    const contentType = optionHeaders.get('Content-Type') || optionHeaders.get('content-type');
    
    if (options.body && ['POST', 'PUT', 'PATCH'].includes((options.method || 'GET').toUpperCase()) && !(options.body instanceof FormData)) {
      if (contentType) {
        headers.set('Content-Type', contentType);
        console.log(`📄 Using Content-Type from options: ${contentType}`);
      } else {
        headers.set('Content-Type', 'application/json');
        console.log('📄 Using default Content-Type: application/json');
      }
    }

    // Copy other headers (excluding Authorization and Content-Type)
    if (options.headers) {
      optionHeaders.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (lowerKey !== 'content-type' && lowerKey !== 'authorization') {
          headers.append(key, value);
        }
      });
    }

    const fetchOptions = {
      ...options,
      headers,
      credentials: 'include' // Include cookies if needed
    };
    
    console.log('🚀 Making authenticated request...');
    let response = await fetch(url, fetchOptions);
    console.log(`📥 Response received: Status ${response.status} for ${url}`);
    
    // Log response headers for debugging
    console.log('📋 Response headers:', [...response.headers.entries()]);

    if (response.status === 401) {
      console.log('🚨 Received 401 Unauthorized, clearing auth and redirecting');
      tokenService.clearAuthData();
      navigationService.navigate('/');
      throw new Error('Authentication failed - please log in again');
    }

    return response;
  };
};

export const authenticatedFetch = createAuthenticatedFetch();