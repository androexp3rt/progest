import mongoose, { Schema, Document } from "mongoose";

export interface BusinessUser extends Document {
  name: string;
  companyName: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  role: string;
}

// Updated User schema
const BusinessUserSchema: Schema<BusinessUser> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  companyName: {
    type: String,
    required: [true, "Company Name is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify Code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "user",
    required: [true, "User Role is required"],
  },
});

const BusinessUserModel =
  (mongoose.models.BusinessUsers as mongoose.Model<BusinessUser>) ||
  mongoose.model<BusinessUser>("BusinessUsers", BusinessUserSchema);

export default BusinessUserModel;