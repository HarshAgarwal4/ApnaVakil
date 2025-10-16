import mongoose from "mongoose";
import { hashPassword } from "../../services/encryption.js";
import { type } from "os";

const UserSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
      unique: true,
    },
    password: {
      required: true,
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    plan:{
      type: String,
      enum: ["free", "Basic" , "Premium"],
      default: "free",
    },
    expDate: {
      type: Date,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    }
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const r = await hashPassword(this.password);
    if (!r) {
      console.log("Error in hashing password");
      return next(new Error("Error in hashing password"));
    }
    this.password = r;
    next();
  } catch (error) {
    console.error("Password hashing failed:", error);
    next(error);
  }
});

const userModel = mongoose.model("User", UserSchema);

export default userModel;
