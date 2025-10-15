import tokenService from './tokenService';

const navigationService = {
  navigate: (path) => {
 
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  }
};

export const setNavigation = (navigate) => {
  navigationService.navigate = navigate;
};

export const BOOKS_API_BASE_URL = 'https://books-api.addispages.com/api/v1';

// export const createAuthenticatedFetch = () => {
//   return async (url, options = {}) => {
  
    
//     let token = await tokenService.getValidToken();
  
    
//     if (!token) {
 
//       tokenService.clearAuthData();
//       navigationService.navigate('/');
//       throw new Error('No valid token available');
//     }

//     const headers = new Headers();
//     headers.append('Accept', 'application/json');
//     headers.append('Authorization', `Bearer ${token}`);
 

//     // Handle Content-Type for requests with body
//     const optionHeaders = options.headers ? new Headers(options.headers) : new Headers();
//     const contentType = optionHeaders.get('Content-Type') || optionHeaders.get('content-type');
    
//     if (options.body && ['POST', 'PUT', 'PATCH'].includes((options.method || 'GET').toUpperCase()) && !(options.body instanceof FormData)) {
//       if (contentType) {
//         headers.set('Content-Type', contentType);
      
//       } else {
//         headers.set('Content-Type', 'application/json');
     
//       }
//     }

//     // Copy other headers (excluding Authorization and Content-Type)
//     if (options.headers) {
//       optionHeaders.forEach((value, key) => {
//         const lowerKey = key.toLowerCase();
//         if (lowerKey !== 'content-type' && lowerKey !== 'authorization') {
//           headers.append(key, value);
//         }
//       });
//     }

//     const fetchOptions = {
//       ...options,
//       headers,
//       credentials: 'include' // Include cookies if needed
//     };
    
 
//     let response = await fetch(url, fetchOptions);
   
    
 

//     if (response.status === 401) {
   
//       tokenService.clearAuthData();
//       navigationService.navigate('/');
//       throw new Error('Authentication failed - please log in again');
//     }

//     return response;
//   };
// };

export const createAuthenticatedFetch = () => {
  return async (url, options = {}) => {
    let token = await tokenService.getValidToken();
    
    if (!token) {
      tokenService.clearAuthData();
      navigationService.navigate('/');
      throw new Error('No valid token available');
    }

    const headers = new Headers();
    
    // Set the exact headers from your curl command
    headers.append('accept', '*/*');
    headers.append('Authorization', `Bearer ${token}`);

    // Only add Content-Type for requests with body that aren't FormData
    if (options.body && 
        ['POST', 'PUT', 'PATCH'].includes((options.method || 'GET').toUpperCase()) && 
        !(options.body instanceof FormData)) {
      
      const optionHeaders = options.headers ? new Headers(options.headers) : new Headers();
      const contentType = optionHeaders.get('Content-Type') || optionHeaders.get('content-type');
      
      if (contentType) {
        headers.set('Content-Type', contentType);
      } else {
        headers.set('Content-Type', 'application/json');
      }
    }

    // Copy other headers (excluding the ones we've already set)
    if (options.headers) {
      const optionHeaders = new Headers(options.headers);
      optionHeaders.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (lowerKey !== 'content-type' && lowerKey !== 'authorization' && lowerKey !== 'accept') {
          headers.append(key, value);
        }
      });
    }

    const fetchOptions = {
      ...options,
      headers,
      credentials: 'include'
    };
    
    let response = await fetch(url, fetchOptions);

    if (response.status === 401) {
      tokenService.clearAuthData();
      navigationService.navigate('/');
      throw new Error('Authentication failed - please log in again');
    }

    return response;
  };
};
export const authenticatedFetch = createAuthenticatedFetch();