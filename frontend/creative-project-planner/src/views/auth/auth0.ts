import { Auth0Client, RedirectLoginResult, createAuth0Client } from '@auth0/auth0-spa-js';

let auth0Client: Auth0Client | null = null;

// Initialize the Auth0 client
const initializeAuth = async (): Promise<void> => {
  auth0Client = await createAuth0Client({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      scope: 'read:projects write:projects'
    },
  });
};

export const getTokenSilently = async (): Promise<string> => {
  if (!auth0Client) {
    throw new Error('Auth0 client has not been initialized');
  }
  
  try {
    return await auth0Client.getTokenSilently();
  } catch (error) {
    console.error('Error getting token silently:', error);
    throw error;
  }
};

// Get the Auth0 client
export const getAuth0Client = (): Auth0Client | null => auth0Client;

// Redirect login with Auth0
export const loginWithRedirect = async (): Promise<void> => {
  if (auth0Client) {
    await auth0Client.loginWithRedirect();
  } else {
    throw new Error('Auth0 client has not been initialized');
  }
};

// Handle the redirect callback after login
export const handleRedirectCallback = async (): Promise<RedirectLoginResult> => {
  if (auth0Client) {
    return await auth0Client.handleRedirectCallback();
  } else {
    throw new Error('Auth0 client has not been initialized');
  }
};

// Check if the user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  if (auth0Client) {
    return await auth0Client.isAuthenticated();
  } else {
    throw new Error('Auth0 client has not been initialized');
  }
};

// Get the authenticated user's information
export const getUser = async (): Promise<any> => {
  if (auth0Client) {
    return await auth0Client.getUser();
  } else {
    throw new Error('Auth0 client has not been initialized');
  }
};

// Logout the user
export const logout = (): void => {
  if (auth0Client) {
    auth0Client.logout({
      logoutParams: { returnTo: window.location.origin }, // Redirect to this URL after logout
    });
  } else {
    throw new Error('Auth0 client has not been initialized');
  }
};

// Initialize the Auth0 client (alias)
export const initializeAuth0 = initializeAuth;
