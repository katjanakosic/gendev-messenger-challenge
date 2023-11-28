import * as mongoose from "mongoose";

export enum UserTypeEnum {
  CUSTOMER = "customer",
  SERVICE_PROVIDER = "service provider",
}

const userModel = new mongoose.Schema(
  {
    name: { type: mongoose.Schema.Types.String, required: true },
    email: { type: mongoose.Schema.Types.String, required: true },
    password: { type: mongoose.Schema.Types.String, required: true },
    user_type: {
      type: mongoose.Schema.Types.String,
      enum: Object.values(UserTypeEnum),
      required: true,
    },
    pfp: {
      type: mongoose.Schema.Types.String,
      required: false,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userModel);

export default User;
