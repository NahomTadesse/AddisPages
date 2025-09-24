import Cookies from 'js-cookie';

class TokenService {
  static instance = null;

  constructor() {
    if (TokenService.instance) {
      return TokenService.instance;
    }
    TokenService.instance = this;
  }

  getAuthData() {
    try {
      const authData = Cookies.get('authData');
      return authData ? JSON.parse(authData) : null;
    } catch (error) {
      console.error('Error parsing auth data:', error);
      this.clearAuthData();
      return null;
    }
  }

  getAccessToken() {
    const authData = this.getAuthData();
    return authData?.access_token || null;
  }

  isTokenExpired(token) {
    try {
      console.log('🔍 Checking token expiration...');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expired = payload.exp * 1000 < Date.now();
      console.log(`⏰ Token exp: ${new Date(payload.exp * 1000).toISOString()}, Now: ${new Date().toISOString()}, Expired: ${expired}`);
      return expired;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  setAuthData(authData) {
    console.log('💾 Setting auth data:', authData);
    
    // Calculate expiration from JWT or use default
    let expiresDate = 7; // 7 days default
    try {
      const payload = JSON.parse(atob(authData.access_token.split('.')[1]));
      const expInMs = payload.exp * 1000;
      const expiresInDays = (expInMs - Date.now()) / (1000 * 60 * 60 * 24);
      expiresDate = Math.max(1, Math.floor(expiresInDays));
      console.log(`📅 Token expires in ~${expiresInDays.toFixed(2)} days (${expiresDate} days for cookie)`);
    } catch (error) {
      console.warn('⚠️ Could not parse token expiration, using 7 days default');
    }
    
    Cookies.set('authData', JSON.stringify(authData), {
      expires: expiresDate,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax'
    });
    
    console.log('✅ Auth data saved to cookie');
  }

  clearAuthData() {
    console.log('🗑️ Clearing auth data');
    Cookies.remove('authData');
  }

  async getValidToken() {
    const authData = this.getAuthData();
    console.log('🔑 Getting valid token, authData exists:', !!authData);
    
    if (!authData) {
      console.log('❌ No auth data found in cookies');
      return null;
    }

    const token = authData.access_token;
    if (!token) {
      console.log('❌ No access token in auth data');
      this.clearAuthData();
      return null;
    }

    console.log('🔍 Validating token...');
    if (this.isTokenExpired(token)) {
      console.log('⏰ Token is expired, clearing auth data');
      this.clearAuthData();
      return null;
    }

    console.log('✅ Returning valid token');
    return token;
  }
}

export default new TokenService();