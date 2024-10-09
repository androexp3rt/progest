import dbConnect from "@/lib/dbConnect";
import BusinessUserModel from "@/model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { companyName, fullName, email, password } = await request.json();
    const existingUserByCompanyName = await BusinessUserModel.findOne({
      companyName,
    });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByCompanyName) {
      if (existingUserByCompanyName.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Company account already exists.",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByCompanyName.name = fullName;
        existingUserByCompanyName.companyName = companyName;
        existingUserByCompanyName.password = hashedPassword;
        existingUserByCompanyName.verifyCode = verifyCode;
        existingUserByCompanyName.verifyCodeExpiry = new Date(
          Date.now() + 3600000
        );
        await existingUserByCompanyName.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new BusinessUserModel({
        companyName,
        name: fullName,
        email,
        password: hashedPassword,
        verifyCode,
        isVerified: false,
        verifyCodeExpiry: expiryDate,
        role: "manager",
      });
      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      companyName,
      fullName,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message:
          "Company account registered successfully. Please verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}
