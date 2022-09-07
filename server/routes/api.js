const express = require('express');
// const controllers = require('../controllers/controller');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('success in router.get');
  res.status(200).json('Success');
});

module.exports = router;
