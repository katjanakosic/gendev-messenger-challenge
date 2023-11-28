import * as mongoose from "mongoose";

const userModel = new mongoose.Schema(
  {
    id: { type: mongoose.Types.ObjectId },
    name: { type: String, require: true },
    email: { type: String, require: true },
    pfp: {
      type: String,
      require: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userModel);

module.exports = User;
