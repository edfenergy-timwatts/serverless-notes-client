const dev = {
  s3: {
    REGION: "eu-west-2",
    BUCKET: "bucket1-timwatts"
  },
  apiGateway: {
    REGION: "eu-west-2",
    URL: "https://5xniudiah3.execute-api.eu-west-2.amazonaws.com/dev"
  },
  cognito: {
    REGION: "eu-west-2",
    USER_POOL_ID: "eu-west-2_GZgyIwZkc",
    APP_CLIENT_ID: "34nnkubbc0bn4421qc7m2690jb",
    IDENTITY_POOL_ID: "eu-west-2:e2266baa-d350-4f7e-9a7e-0a6cbd94e240"
  }
};

const prod = {
  s3: {
    REGION: "eu-west-2",
    BUCKET: "bucket1-timwatts"
  },
  apiGateway: {
    REGION: "eu-west-2",
    URL: "https://7cyjpxt0p1.execute-api.eu-west-2.amazonaws.com/prod"
  },
  cognito: {
    REGION: "eu-west-2",
    USER_POOL_ID: "eu-west-2_i2mvIwbAf",
    APP_CLIENT_ID: "ea3fc0ccjnd8heu9qe9r948fr",
    IDENTITY_POOL_ID: "eu-west-2:2461e53c-11ab-4a50-8c62-ade1b5cd43b1"
  }
};

// Set REACT_APP_STAGE prior to invoking npm start (or npm run build),
// to determine whether dev or prod backend resources are used (default is dev)
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};
