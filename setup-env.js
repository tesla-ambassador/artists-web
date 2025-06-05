const { config } = require("dotenv");

config({ path: "./.env.local" });
const {
  SSMClient,
  GetParametersByPathCommand,
} = require("@aws-sdk/client-ssm");
const fs = require("fs");

const ssm = new SSMClient({ region: "ap-southeast-1" });

const envMap = {
  "/s3/imagesBucket": "NEXT_PUBLIC_AWS_IMAGES_BUCKET",
  "/s3/region": "NEXT_PUBLIC_AWS_STORAGE_REGION",
  "/cognito/idtPoolId": "NEXT_PUBLIC_AWS_IDENTITY_POOL_ID",
  "/cognito/webClientId": "NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID",
  "/cognito/userPoolId": "NEXT_PUBLIC_AWS_USER_POOL_ID",
  "/cognito/region": "NEXT_PUBLIC_AWS_REGION",
  "/s3/rawAudioBucket": "NEXT_PUBLIC_AWS_RAW_AUDIO_BUCKET",
  "/ws/process-update": "NEXT_PUBLIC_AWS_WEBSOCKET_URL",
  "/gql/gql-endpoint": "NEXT_PUBLIC_AWS_GQL_ENDPOINT",
  "/cdn/hls-audio": "NEXT_PUBLIC_AWS_CLOUDFRONT_ENDPOINT",
  Cloudflare: "NEXT_PUBLIC_AWS_CLOUDFLARE_PATH",
};

const update = async () => {
  const cognitoPath = new GetParametersByPathCommand({ Path: "/cognito/" });
  const s3Path = new GetParametersByPathCommand({ Path: "/s3/" });
  const wsPath = new GetParametersByPathCommand({ Path: "/ws/" });
  const gqlPath = new GetParametersByPathCommand({ Path: "/gql/" });
  const cdnPath = new GetParametersByPathCommand({ Path: "/cdn/" });

  const [s3Config, cognitoConfig, wsConfig, gqlConfig, cdnConfig] =
    await Promise.all([
      ssm.send(s3Path),
      ssm.send(cognitoPath),
      ssm.send(wsPath),
      ssm.send(gqlPath),
      ssm.send(cdnPath),
    ]);
  const mergedArray = [
    ...s3Config.Parameters,
    ...cognitoConfig.Parameters,
    ...wsConfig.Parameters,
    ...gqlConfig.Parameters,
    ...cdnConfig.Parameters,
    {
      Name: "Cloudflare",
      Value: "https://imagedelivery.net/X2Vymse95DWhWMx3YOWyog",
    },
  ];
  const envStr = mergedArray
    .map((item) => {
      const envProp = envMap[item.Name];
      return [envProp, item.Value].join("=");
    })
    .join("\n");
  fs.writeFileSync("./.env", envStr);
};

update();
