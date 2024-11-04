import dbConnect from "@/lib/dbConnect";
import AdminModel, { Admin } from "@/model/admin";
import BusinessUserModel, { BusinessUser } from "@/model/businessUser";
import NotificationModel from "@/model/notification";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  const { name, companyName, email, password, role, creatorEmail } =
    await request.json();
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
          const toUsers: string[] = [];
          const adminUsers = await AdminModel.find({});
          adminUsers.map((admin: Admin) => {
            toUsers.push(admin.email);
          });
          if (toUsers.includes(creatorEmail)) {
            const index = toUsers.indexOf(creatorEmail);
            toUsers.splice(index, 1);
          }
          if (toUsers.includes(emailLc)) {
            const i = toUsers.indexOf(emailLc);
            toUsers.splice(i, 1);
          }
          const notification = new NotificationModel({
            title: "New Admin user Created",
            message: `A new Admin user ${emailLc} is created by ${creatorEmail}, for the company ${companyNameLc}.`,
            toUser: toUsers,
            fromUser: creatorEmail,
          });
          await notification.save();
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
      if (toUsers.includes(emailLc)) {
        const i = toUsers.indexOf(emailLc);
        toUsers.splice(i, 1);
        const notification = new NotificationModel({
          title: "New Manager user Created",
          message: `A new Manager User ${emailLc} is created by ${creatorEmail}, for the company ${companyNameLc}.`,
          toUser: toUsers,
          fromUser: creatorEmail,
        });
        await notification.save();
      } else {
        const notification = new NotificationModel({
          title: "New User Created",
          message: `A new User ${emailLc} is created by ${creatorEmail}, for the company ${companyNameLc}.`,
          toUser: toUsers,
          fromUser: creatorEmail,
        });
        await notification.save();
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
