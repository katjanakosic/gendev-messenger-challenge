import * as mongoose from "mongoose"
import bcrypt from "bcrypt"

export enum UserTypeEnum {
  CUSTOMER = "customer",
  SERVICE_PROVIDER = "service_provider",
}

export interface UserDocument extends mongoose.Document {
  name: string
  email: string
  password: string
  address: string
  phone_number: string
  url?: string
  user_type: string
  pfp?: string
  ratings: number[]
}

const userModel = new mongoose.Schema({
  name: { type: mongoose.Schema.Types.String, required: true },
  email: { type: mongoose.Schema.Types.String, required: true, unique: true },
  password: { type: mongoose.Schema.Types.String, required: true },
  address: { type: mongoose.Schema.Types.String, required: true },
  phone_number: { type: mongoose.Schema.Types.String, required: true },
  url: { type: mongoose.Schema.Types.String, required: false },
  user_type: {
    type: mongoose.Schema.Types.String,
    enum: Object.values(UserTypeEnum),
    required: true,
  },
  pfp: {
    type: mongoose.Schema.Types.String,
    required: false,
  },
  ratings: { type: [mongoose.Schema.Types.Number], required: true },
})

userModel.pre("save", async function (next) {
  if (!this.isModified) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

export const User = mongoose.model("User", userModel)
