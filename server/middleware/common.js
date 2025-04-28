const path = require('path');
const dotenv = require('dotenv');
//const { logger, logErrorDetails } = require('../tools/logger');  // Adjust the path as needed

// Load environment variables based on NODE_ENV
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, `../.env.${env}`) });

function authenticate(req, res, next) {
  const token = req.headers['x-user-token'];
  if (token) {
    next();
  } else {
    const errorMessage = 'Unauthorized: No token provided';
    //logErrorDetails({ message: errorMessage }, 'Error processing request');
    res.status(401).json({ message: errorMessage });
  }
}

const apiHeaders = {
  'X-Api-Key': process.env.API_KEY
};

function prepareHeaders(req) {
  // const userToken = req.headers['key'];

  return {
      'Content-Type': 'application/json',
      // 'x-api-key': process.env.API_KEY,
      // 'x-user-token': userToken,
  };
}

// Exporting all together
module.exports = {
  authenticate,
  prepareHeaders,
  apiHeaders
};
