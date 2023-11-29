import asyncHandler from "express-async-handler"
import { Request, Response } from "express"
import { User } from "../models/UserModel"
import { generateToken } from "../config/generateToken"
import bcrypt from "bcrypt"
import { connect } from "http2"

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("In registerUser")
    const { name, email, password, address, phone_number, user_type, url, pfp } =
      req.body

    console.log("Body")
    console.log(req.body)
    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !phone_number ||
      !user_type
    ) {
      res.status(400)
      throw new Error("Please provide all fields")
    }
    console.log("Data provided")

    const userExists = await User.findOne({ email })
    console.log(userExists)

    if (userExists) {
      res.status(400)
      throw new Error("This user already exists")
    }

    console.log("User exist")

    const user = await User.create({
      name,
      email,
      password,
      address,
      phone_number,
      pfp,
      user_type,
      url,
    })

    console.log("User created")
    console.log(user)

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
  console.log("In authUser")
  const { email, password } = req.body
  console.log("Data", email, password)

  const user = await User.findOne({ email })
  console.log("User", user)

  if (user && (await bcrypt.compare(password, user.password))) {
    console.log("Authenticated")
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
