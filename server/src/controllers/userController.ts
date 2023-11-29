import asyncHandler from "express-async-handler"
import { Request, Response } from "express"
import { User, UserTypeEnum } from "../models/UserModel"
import { generateToken } from "../config/generateToken"
import bcrypt from "bcrypt"

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("In registerUser")
    const {
      name,
      email,
      password,
      address,
      phone_number,
      user_type,
      url,
      pfp,
    } = req.body

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
      user_type,
      url,
      pfp,
      ratings: [],
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
        pfp: user.pfp,
        ratings: user.ratings,
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
      pfp: user.pfp,
      ratings: user.ratings,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error("Invalid e-mail or password.")
  }

  console.log("End of authUser")
})

interface User {
  id: string
}

export const getServiceProviders = asyncHandler(async (req: Request, res: Response) => {
  const db_query = req.query.search
  ? {
      $and: [
        {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        },
        { user_type: UserTypeEnum.SERVICE_PROVIDER },
      ],
    }
  : { user_type: UserTypeEnum.SERVICE_PROVIDER };

  const users = await User.find(db_query).find({
    _id: { $ne: (req.user as User).id },
  })
  res.send(users)
})
