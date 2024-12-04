import { Auth0Client, RedirectLoginResult, createAuth0Client, Auth0ClientOptions } from '@auth0/auth0-spa-js';
import axios from 'axios'; 

let auth0Client: Auth0Client | null = null;

export const initializeAuth0 = async (): Promise<Auth0Client> => {
  if (auth0Client) return auth0Client;

  const options: Auth0ClientOptions = {
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: window.location.origin + '/callback',
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      scope: 'openid profile email'
    }
  };

  auth0Client = await createAuth0Client(options);
  return auth0Client;
};

export const handleAuthCallback = async (): Promise<void> => {
  const client = await initializeAuth0();
  
  try {
    await client.handleRedirectCallback();
    const user = await client.getUser();
    
    if (user) {
      await syncSocialLoginUser(user);
    }
  } catch (error) {
    console.error('Error handling auth callback:', error);
    throw error;
  }
};

const syncSocialLoginUser = async (socialUser: any) => {
  try {
    const response = await axios.post('/api/users/social-login', {
      email: socialUser.email,
      firstName: socialUser.given_name || socialUser.nickname,
      lastName: socialUser.family_name,
      profilePicture: socialUser.picture,
      provider: socialUser.iss
    });

    localStorage.setItem('authToken', response.data.token);
    return response.data.user;
  } catch (error) {
    console.error('Social login sync error:', error);
    throw error;
  }
};

export const getAuth0Client = (): Auth0Client | null => auth0Client;

export const loginWithRedirect = async (): Promise<void> => {
  const client = await initializeAuth0();
  await client.loginWithRedirect();
};

export const handleRedirectCallback = async (): Promise<RedirectLoginResult> => {
  const client = await initializeAuth0();
  return await client.handleRedirectCallback();
};

export const isAuthenticated = async (): Promise<boolean> => {
  const client = await initializeAuth0();
  return await client.isAuthenticated();
};

export const getUser = async (): Promise<any> => {
  const client = await initializeAuth0();
  return await client.getUser();
};

export const logout = async (): Promise<void> => {
  const client = await initializeAuth0();
  client.logout({
    logoutParams: { returnTo: window.location.origin }
  });
};