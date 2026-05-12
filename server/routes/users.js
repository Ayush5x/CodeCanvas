import express from 'express'
import User from '../models/User.js'

const router = express.Router()

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create user (signup)
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const user = new User({ name, email })
    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Get user count (for stats)
router.get('/stats/count', async (req, res) => {
  try {
    const count = await User.countDocuments()
    res.json({ count })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
