// Import all env vars from .env file
require('dotenv').config()

const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
const SERVICE_URL = process.env.SERVICE_URL;
const PORT = process.env.PORT;
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
// Need replace afterwards because: https://stackoverflow.com/questions/50299329/node-js-firebase-service-account-private-key-wont-parse
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
const GROUPME_ACCESS_TOKEN = process.env.GROUPME_ACCESS_TOKEN;

module.exports = {
    MONGODB_CONNECTION_STRING: MONGODB_CONNECTION_STRING,
    SERVICE_URL: SERVICE_URL,
    PORT: PORT,
    FIREBASE_PROJECT_ID: FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: FIREBASE_PRIVATE_KEY,
    GROUPME_ACCESS_TOKEN: GROUPME_ACCESS_TOKEN
}