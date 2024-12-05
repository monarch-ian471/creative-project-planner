import router from '@/router';
import { Auth0Client, RedirectLoginResult, createAuth0Client, Auth0ClientOptions } from '@auth0/auth0-spa-js';
import axios from 'axios'; 
import { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.API_BASE_URL;

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

  try {
    auth0Client = await createAuth0Client(options);
  } catch (error) {
    console.error('Error initializing Auth0 client:', error);
    throw new Error('Auth0 initialization failed.');
  }
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
    if (!user) {
      console.error('Failed to retrieve user after authentication callback.');
      router.push('/auth/login'); // Redirect to login page
      return;
    }       
  } catch (error) {
    console.error('Error handling auth callback:', error);
    throw error;
  }
};

const syncSocialLoginUser = async (socialUser: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/social-login`, {
      email: socialUser.email,
      firstName: socialUser.given_name || socialUser.nickname,
      lastName: socialUser.family_name,
      profilePicture: socialUser.picture,
      provider: socialUser.iss
    });

    // Store the received token in sessionStorage (or localStorage if preferred)
    sessionStorage.setItem('authToken', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data in localStorage
    
    return response.data.user;
  } catch (error) {
    console.error('Social login sync error:', error);

    // Handle backend error response
    if (axios.isAxiosError(error)) {
      // Display error message from backend
      alert(`Error: ${error.response?.data?.message || 'Unknown error'}`);
    } else {
      // Network or other errors
      alert('There was an error with the request.');
    }
    throw error; // Re-throw the error if needed for further handling in the application
  }
};


export const getAuth0Client = (): Auth0Client | null => auth0Client;

export const loginWithRedirect = async (): Promise<void> => {
  const client = await initializeAuth0();
  await client.loginWithRedirect();
};

export const handleRedirectCallback = async (): Promise<any> => {
  const client = await initializeAuth0();
  try {
    return await client.handleRedirectCallback();
  } catch (error) {
    console.error('Error in handleRedirectCallback:', error);
    router.push('/auth/login');  // You could also add a query parameter for the error reason
    return;
  }
};


export const isAuthenticated = async (): Promise<boolean> => {
  const client = await initializeAuth0();
  const user = localStorage.getItem('user');
  if (user) return JSON.parse(user);
  return await client.isAuthenticated();
};


export const getUser = async (): Promise<any> => {
  const client = await initializeAuth0();
  const user = localStorage.getItem('user');
  if (user) return JSON.parse(user);
  return await client.getUser();
};

export const logout = async (): Promise<void> => {
  const client = await initializeAuth0();
  client.logout({
    logoutParams: { returnTo: window.location.origin }
  });
  localStorage.removeItem('user'); // Make sure to clear this on logout
  sessionStorage.removeItem('authToken');
};