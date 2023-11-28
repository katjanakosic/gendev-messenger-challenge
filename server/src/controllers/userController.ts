import asyncHandler from "express-async-handler"
import { Request, Response } from "express"
import { User } from "../models/UserModel"
import {generateToken} from "../config/generateToken"
import bcrypt from "bcrypt"

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password, address, phone_number, user_type } = req.body

    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !phone_number ||
      !user_type
    ) {
      res.status(400)
      throw new Error("Please provide all fields.")
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      res.status(400)
      throw new Error("This user already exists.")
    }

    const user = await User.create({
      name,
      email,
      password,
      address,
      phone_number,
      user_type,
    })

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone_number: user.phone_number,
        user_type: user.user_type,
        token: generateToken(user._id),
      })
    } else {
      res.status(400)
      throw new Error("Cannot create user.")
    }
  }
)

export const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone_number: user.phone_number,
      user_type: user.user_type,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error("Invalid e-mail or password.")
  }
})
