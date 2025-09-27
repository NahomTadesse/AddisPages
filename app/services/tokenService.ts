


import Cookies from 'js-cookie';

class TokenService {
  static instance: TokenService | null = null;

  constructor() {
    if (TokenService.instance) {
      return TokenService.instance;
    }
    // Explicitly assign `this` to `instance`
    TokenService.instance = this as TokenService;
  }

  // Rest of your code remains unchanged
  getAuthData() {
    try {
      const authData = Cookies.get('authData');
      return authData ? JSON.parse(authData) : null;
    } catch (error) {
    
      this.clearAuthData();
      return null;
    }
  }

  getAccessToken() {
    const authData = this.getAuthData();
    return authData?.access_token || null;
  }

  isTokenExpired(token: string) {
    try {
    
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expired = payload.exp * 1000 < Date.now();
   
      return expired;
    } catch (error) {
     
      return true;
    }
  }

  setAuthData(authData: any) {
 
    
    let expiresDate = 7; // 7 days default
    try {
      const payload = JSON.parse(atob(authData.access_token.split('.')[1]));
      const expInMs = payload.exp * 1000;
      const expiresInDays = (expInMs - Date.now()) / (1000 * 60 * 60 * 24);
      expiresDate = Math.max(1, Math.floor(expiresInDays));
    
    } catch (error) {
   
    }
    
    Cookies.set('authData', JSON.stringify(authData), {
      expires: expiresDate,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax'
    });
    
  
  }

  clearAuthData() {
  
    Cookies.remove('authData');
  }

  async getValidToken() {
    const authData = this.getAuthData();
   
    
    if (!authData) {
    
      return null;
    }

    const token = authData.access_token;
    if (!token) {
   
      this.clearAuthData();
      return null;
    }


    if (this.isTokenExpired(token)) {
   
      this.clearAuthData();
      return null;
    }

  
    return token;
  }
}

export default new TokenService();