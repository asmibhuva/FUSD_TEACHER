export const REGION = process.env.REACT_APP_REGION;

export const AWSConfig = {
  aws_project_region: REGION,
  aws_user_pools_id: process.env.REACT_APP_USERPOOL_ID,
  aws_user_pools_web_client_id: process.env.REACT_APP_APP_CLIENT_ID,
  authenticationFlowType: "USER_PASSWORD_AUTH",
};

export const AWSAppSyncConfig = {
  aws_appsync_graphqlEndpoint: process.env.REACT_APP_APPSYNC_ENDPOINT,
  aws_appsync_region: REGION,
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
};

export const COGNITODOMAIN = process.env.REACT_APP_DOMAIN;
export const MS_SAML = process.env.REACT_APP_MS_SAML;
export const HOSTURL = process.env.REACT_APP_REDIRECT_URI;

// export const HOSTURL = "http://localhost:3000/"
console.log("Envs from aws-exports", process.env.REACT_APP_REGION);
