import User from '@/models/User'
import db from '@/utils/db'
import { sendEmail } from '@/utils/sendEmail'
import { createActivationToken } from '@/utils/token'
import { validateEmail } from '@/utils/validation'
import bcrypt from 'bcrypt'
import nextConnect from 'next-connect'

const handler = nextConnect()

handler.post(async (req, res) => {
  try {
    await db.connectDb()
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Please fill in all fields' })
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email.' })
    }

    const user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'This email already exists.' })
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters.' })
    }
    const cryptedPassword = await bcrypt.hash(password, 12)
    const newUser = new User({ name, email, password: cryptedPassword })
    const addedUser = await newUser.save()
    const activation_token = createActivationToken({
      id: addedUser._id.toString(),
    })

    const url = `${process.env.BASE_URL}/activate/${activation_token}`
    sendEmail(email, url, '', 'Activate your account.')
    await db.disconnectDb()
    res.json({
      message: 'Register success! Please activate your email to start',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default handler
