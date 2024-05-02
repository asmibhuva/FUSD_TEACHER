import { Auth } from 'aws-amplify';

export const signIn = (credentials) => {
  return Auth.signIn(credentials.username, credentials.password);
}

export async function signOut() {
  return await Auth.signOut();
}