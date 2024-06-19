// src\cognito\index.ts
import config from '../config'
import cognito from './cognito';

export const getCognitoUser = async (accessToken: string) => {
    if (accessToken) {
      const cognitoUser = await cognito.getUserByAccessToken(accessToken);
      if (cognitoUser && cognitoUser.email && cognitoUser.email === config.user.email) {
        return cognitoUser;
      }
    }
    throw new Error('Unauthorized');
  }