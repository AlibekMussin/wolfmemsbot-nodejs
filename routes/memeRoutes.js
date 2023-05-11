const express = require('express');
const router = express.Router();
const MemeRequest = require('../models/MemeRequest');
const fs = require('fs');


router.get('/memes', async (req, res) => {
  try {
    const memes = await MemeRequest.find({
      //  status: 'APPROVED'
       });
    res.render('index', { memes });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post('/memes/:id/accept', async (req, res) => {
  try {
    const meme = await MemeRequest.findByIdAndUpdate(req.params.id, { accepted: true });
    res.json(meme);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post('/memes/:id/decline', async (req, res) => {
  try {
    const meme = await MemeRequest.findByIdAndUpdate(req.params.id, { declined: true });
    res.json(meme);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;