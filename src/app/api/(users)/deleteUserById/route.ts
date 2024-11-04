import dbConnect from "@/lib/dbConnect";
import BusinessUserModel from "@/model/businessUser";
import UserModel from "@/model/user";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = true;

export async function POST(request: NextRequest) {
  await dbConnect();
  const { id } = await request.json();
  try {
    let user = await UserModel.findById({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!user) {
      user = await BusinessUserModel.findById({
        _id: new mongoose.Types.ObjectId(id),
      });
      if (!user) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 200 }
        );
      }
    }
    await user.deleteOne();
    return NextResponse.json(
      { success: true, message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting User:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting User" },
      { status: 500 }
    );
  }
}
