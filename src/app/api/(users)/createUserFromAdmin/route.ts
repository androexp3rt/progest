import dbConnect from "@/lib/dbConnect";
import BusinessUserModel from "@/model/businessUser";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  const { name, companyName, email, password, role } = await request.json();
  try {
    const existingUser = await UserModel.findOne({ email });
    const existingBusinessUser = await BusinessUserModel.findOne({ email });
    if (!existingUser && !existingBusinessUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      if (role === "manager" || role === "admin") {
        const newUser = new BusinessUserModel({
          name,
          companyName,
          email,
          password: hashedPassword,
          role: role,
          isVerified: true,
          verifyCode: "000000",
          verifyCodeExpiry: new Date(),
        });
        await newUser.save();
      } else {
        const newUser = new UserModel({
          name,
          companyName,
          email,
          password: hashedPassword,
          role: role,
          isVerified: true,
        });
        await newUser.save();
      }
      return NextResponse.json(
        { success: true, message: "Users created successfully" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, message: "User already exists with this email" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error creating User:", error);
    return NextResponse.json(
      { success: false, message: "Error creating User" },
      { status: 500 }
    );
  }
}
