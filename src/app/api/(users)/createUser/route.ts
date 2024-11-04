import dbConnect from "@/lib/dbConnect";
import AdminModel, { Admin } from "@/model/admin";
import BusinessUserModel, { BusinessUser } from "@/model/businessUser";
import NotificationModel from "@/model/notification";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  const { name, companyName, email, password, creatorEmail } =
    await request.json();
  const emailLc = email.toLowerCase();
  const companyNameLc = companyName.toLowerCase();
  try {
    const existingUser = await UserModel.findOne({ companyNameLc, emailLc });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        name,
        companyName: companyNameLc,
        email: emailLc,
        password: hashedPassword,
        role: "user",
        isVerified: true,
      });
      await newUser.save();
      const toUsers: string[] = [];
      const adminUsers = await AdminModel.find({});
      adminUsers.map((admin: Admin) => {
        toUsers.push(admin.email);
      });
      const managerUsers = await BusinessUserModel.find({
        companyName: companyNameLc,
      });
      managerUsers.map((manager: BusinessUser) => {
        toUsers.push(manager.email);
      });
      if (toUsers.includes(creatorEmail)) {
        const index = toUsers.indexOf(creatorEmail);
        toUsers.splice(index, 1);
      }
      const notification = new NotificationModel({
        title: "New User Created",
        message: `A new User ${emailLc} is created by ${creatorEmail}, for the company ${companyNameLc}.`,
        toUser: toUsers,
        fromUser: creatorEmail,
      });
      await notification.save();
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
