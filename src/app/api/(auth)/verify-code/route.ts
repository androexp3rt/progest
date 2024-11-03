import dbConnect from "@/lib/dbConnect";
import AdminModel, { Admin } from "@/model/admin";
import BusinessUserModel from "@/model/businessUser";
import NotificationModel from "@/model/notification";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { email, code } = await request.json();
    const decodedemail = decodeURIComponent(email);
    const user = await BusinessUserModel.findOne({ email: decodedemail });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    // Check if the code is correct and not expired
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      // Update the user's verification status
      user.isVerified = true;
      await user.save();
      const adminUsers = await AdminModel.find({});
      const admins: string[] = [];
      adminUsers.map((admin: Admin) => admins.push(admin.email));
      const notification = new NotificationModel({
        title: "New SignUp",
        message: `A new Business User ${decodedemail} has registered.`,
        toUser: admins,
        fromUser: decodedemail,
      });
      await notification.save();
      return Response.json(
        { success: true, message: "Account verified successfully" },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      // Code has expired
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired. Please sign up again to get a new code.",
        },
        { status: 400 }
      );
    } else {
      // Code is incorrect
      return Response.json(
        { success: false, message: "Incorrect verification code" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    return Response.json(
      { success: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
}
