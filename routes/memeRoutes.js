const express = require('express');
const router = express.Router();
const MemeRequest = require('../models/MemeRequest');
const fs = require('fs');



router.get('/memes', async (req, res) => {
  try {
    const memes = await MemeRequest.find({
      //  status: 'APPROVED'
       });
      //  console.log(memes);
    res.render('index', { memes });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post('/memes/:id/accept', async (req, res) => {
  console.log('accept');
  try {
    // console.log(req.params);
    const meme = await MemeRequest.findByIdAndUpdate(req.params.id, { status: 'APPROVED' });    
    res.sendStatus(200);    
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post('/memes/:id/reject', async (req, res) => {
  console.log('reject');
  try {    
    const meme = await MemeRequest.findByIdAndUpdate(req.params.id, { status: 'DECLINED' });    
    res.sendStatus(200);
    // console.log(meme);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


module.exports = router;