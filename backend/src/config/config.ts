/* eslint-disable @typescript-eslint/no-unused-vars */
import * as dotenv from 'dotenv';
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  aws_cognito: {
    userPoolId: process.env.USER_POOL_ID,
    tokenUse: process.env.TOKEN_USE,
    clientId: process.env.CLIENT_ID,
  },
});
