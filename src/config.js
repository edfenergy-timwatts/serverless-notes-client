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
    URL: "https://4kvfohqoq2.execute-api.eu-west-2.amazonaws.com/prod"
  },
  cognito: {
    REGION: "eu-west-2",
    USER_POOL_ID: "eu-west-2_cFg6rpXwl",
    APP_CLIENT_ID: "765ldg74q80q0109cl6ni8aper",
    IDENTITY_POOL_ID: "eu-west-2:3f685fd0-8d56-4b05-821f-130d757fc6af"
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
