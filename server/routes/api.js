const express = require('express');
const controller = require('../controllers/controller');
const router = express.Router();

router.get('/', (req, res) => {
  console.log('success in router.get');
  // create: recent playlist: book name, author, song name
  // update: favorite
  // delete the created playlist
  res.status(200).json('Success');
});

router.get('/authToken', controller.getAuthToken, (req, res) => {
  // console.log(res.locals.token);
  res.status(200).json(res.locals.token);
});

router.post('/', controller.saveRec, (req, res) => {
  res.status(200).json(res.locals.savedRec);
});

router.get('/savedRecs', controller.getAllRecs, (req, res) => {
  console.log('in saved recs', res.locals.allRecs);
  res.status(200).json(res.locals.allRecs);
});
router.delete('/deleteRec/:albumName', controller.deleteRec, (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
