import mongoose from "mongoose";

const lawyerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      default: "",
    },
    barNumber: {
      type: String,
      default: "",
    },
    experience: {
      type: String,
      default: "5+ Years",
    },
    speciality: {
      type: String,
      default: "High Court & Civil Advocate",
    },
    courts: [
      {
        type: String,
      },
    ],
    languages: [
      {
        type: String,
      },
    ],
    fee: {
      type: String,
      default: "₹1,500 / consultation",
    },
    city: {
      type: String,
      default: "New Delhi",
    },
    address: {
      type: String,
      default: "",
    },
    desc: {
      type: String,
      default: "Experienced legal practitioner specializing in comprehensive legal advisory and litigation.",
    },
    images: {
      type: String,
      default: "/profile.png",
    },
    categories: [
      {
        type: String,
      },
    ],
    verified: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const lawyerModel = mongoose.model("lawyer", lawyerSchema);

export default lawyerModel;