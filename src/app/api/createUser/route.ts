import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  const { name, companyName, email, password } = await request.json();
  try {
    const existingUser = await UserModel.findOne({ companyName, email });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        name,
        companyName,
        email,
        password: hashedPassword,
        role: "user",
      });
      await newUser.save();
      return NextResponse.json(
        { success: true, message: "Users created successfully" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, message: "User already exists with this email" },
      { status: 400 }
    );
  } catch (error) {
    console.log("Error creating User:", error);
    return NextResponse.json(
      { success: false, message: "Error creating User" },
      { status: 500 }
    );
  }
}
