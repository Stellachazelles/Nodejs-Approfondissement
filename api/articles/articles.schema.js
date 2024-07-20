const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['draft', 'published'], 
    default: 'draft' 
  },
  author: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Article', articleSchema);
