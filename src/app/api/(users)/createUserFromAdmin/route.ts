import dbConnect from "@/lib/dbConnect";
import AdminModel from "@/model/admin";
import BusinessUserModel from "@/model/businessUser";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  const { name, companyName, email, password, role } = await request.json();
  const emailLc = email.toLowerCase();
  const companyNameLc = companyName.toLowerCase();
  try {
    if (role === "admin") {
      if (companyNameLc !== "fsalyda") {
        return NextResponse.json(
          {
            success: false,
            message: "Admin users can only belong to Fsalyda organization",
          },
          { status: 200 }
        );
      } else {
        const existingAdmin = await AdminModel.findOne({ email: emailLc });
        if (existingAdmin) {
          return NextResponse.json(
            { success: false, message: "User already exists with this email" },
            { status: 200 }
          );
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = new AdminModel({
            name,
            companyName: companyNameLc,
            email: emailLc,
            password: hashedPassword,
            role: role,
            isVerified: true,
            verifyCode: "000000",
            verifyCodeExpiry: new Date(),
          });
          await newUser.save();
          return NextResponse.json(
            { success: true, message: "Users created successfully" },
            { status: 200 }
          );
        }
      }
    }
    const existingUser = await UserModel.findOne({ email: emailLc });
    const existingBusinessUser = await BusinessUserModel.findOne({
      email: emailLc,
    });
    if (!existingUser && !existingBusinessUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      if (role === "manager") {
        const newUser = new BusinessUserModel({
          name,
          companyName: companyNameLc,
          email: emailLc,
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
          companyName: companyNameLc,
          email: emailLc,
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
    } else {
      return NextResponse.json(
        { success: false, message: "User already exists with this email" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("Error creating User:", error);
    return NextResponse.json(
      { success: false, message: "Error creating User" },
      { status: 500 }
    );
  }
}
