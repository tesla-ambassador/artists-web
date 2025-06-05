const amplifyConfig = {
  userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID,
  identityPoolId: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID,
};

export default amplifyConfig;
