const express = require('express');
const router = express.Router();
const axios = require('axios');
const { apiHeaders, authenticate } = require('../middleware/common');
const { logger, logErrorDetails } = require('../tools/logger');  // Adjust the path as needed
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables based on NODE_ENV
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, `../.env.${env}`) });

const API_BASE_URL = process.env.API_END_POINTS;

//  Place Bet
router.post('/bets', authenticate, async (req, res) => {
  const headers = { ...apiHeaders, 'X-User-Token': req.headers['x-user-token'], 'Authorization': `Bearer ${req.headers['x-user-token']}` };
  try {
      const response = await axios.post(`${API_BASE_URL}/api/game/dice`, req.body, { headers });
      res.json(response.data);
      logger.info(`Place bet successfully.`);
  } catch (error) {
      logErrorDetails(error, 'Error place bet');
      res.status(error.response?.status || 500).json({
          message: error.response?.data?.message,
          code: error.response?.data?.errorCode || 'Internal Server Error'
      });
  }
});

// Get Random Bets List
router.get('/bet-records', authenticate, async (req, res) => {
  const userToken = req.headers['x-user-token'];
  const params = req.query;
  try {
      const headers = { ...apiHeaders, 'X-User-Token': userToken, 'Authorization': `Bearer ${req.headers['x-user-token']}` };
      const response = await axios.get(`${process.env.API_END_POINTS}/api/game/all-bets`, { headers, params });
      res.json(response.data);
      logger.info(`Fetched random bets records.`);
  } catch (error) {
      logErrorDetails(error, 'Error get random bets records');
      res.status(error.response?.status || 500).json({ message: error.response?.data?.message, code:error.response?.data?.errorCode || 'Internal Server Error' });
  }
});

// Get Balance
router.get('/balance', authenticate, async (req, res) => {
  const userToken = req.headers['x-user-token'];
  const params = req.query;
  try {
      const headers = { ...apiHeaders, 'X-User-Token': userToken, 'Authorization': `Bearer ${req.headers['x-user-token']}` };
      const response = await axios.get(`${process.env.API_END_POINTS}/api/wallet/balance`, { headers, params });
      res.json(response.data);
      logger.info(`Fetched balance.`);
  } catch (error) {
      logErrorDetails(error, 'Error get balance');
      res.status(error.response?.status || 500).json({ message: error.response?.data?.message, code:error.response?.data?.errorCode || 'Internal Server Error' });
  }
});

// Get Bets History
router.get('/history', authenticate, async (req, res) => {
  const userToken = req.headers['x-user-token'];
  const params = req.query;
  try {
      const headers = { ...apiHeaders, 'X-User-Token': userToken, 'Authorization': `Bearer ${req.headers['x-user-token']}` };
      const response = await axios.get(`${process.env.API_END_POINTS}/api/game/get-games`, { headers, params });
      res.json(response.data);
      logger.info(`Fetched balance.`);
  } catch (error) {
      logErrorDetails(error, 'Error get balance');
      res.status(error.response?.status || 500).json({ message: error.response?.data?.message, code:error.response?.data?.errorCode || 'Internal Server Error' });
  }
});

module.exports = router;