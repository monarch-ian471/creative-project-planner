import createAuth0Client from '@auth0/auth0-spa-js';

let auth0Client = null;

const initializeAuth0 = async () => {
  auth0Client = await createAuth0Client({
    domain: 'dev-lsauz5y1t0iz3nv2.us.auth0.com',   // Auth0 Domain 
    client_id: 'mUrgD8YKiUq92VHGeY1OGe7JElOYsrHv', // Auth0 Client ID 
    audience: 'https://creative-project-planner-api.com',
    redirect_uri: window.location.origin // Redirect URI (usually your frontend's base URL)
  });
};

export const getAuth0Client = () => auth0Client;

export const loginWithRedirect = async () => {
  await auth0Client.loginWithRedirect();
};

export const handleRedirectCallback = async () => {
  const result = await auth0Client.handleRedirectCallback();
  return result;
};

export const isAuthenticated = async () => {
  return await auth0Client.isAuthenticated();
};

export const getUser = async () => {
  return await auth0Client.getUser();
};

export const logout = async () => {
  auth0Client.logout({
    returnTo: window.location.origin // Redirect to this URL after logout
  });
};

export const initializeAuth = initializeAuth0;
