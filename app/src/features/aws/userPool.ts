import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "ap-southeast-1_ZJJ5utGdH",
  ClientId: "49ntkfv0j8mk20l465ofec6222",
};

const instance = new CognitoUserPool(poolData);

export default instance;
