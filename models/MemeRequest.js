const mongoose = require('mongoose');

const memeRequestSchema = new mongoose.Schema({
  image_url: {
    type: String,
    required: true
  },
  user_id: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['WAITING', 'APPROVED', 'DECLINED'],
    default: 'WAITING'
  }
});

const MemeRequest = mongoose.model('MemeRequest', memeRequestSchema);

module.exports = MemeRequest;