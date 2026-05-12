import mongoose from 'mongoose'

const algorithmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['sorting', 'pathfinding', 'graph'],
  },
  description: {
    type: String,
    required: true,
  },
  complexity: {
    time: String,
    space: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model('Algorithm', algorithmSchema)
