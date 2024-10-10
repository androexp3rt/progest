import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  const { id } = await request.json();
  try {
    const user = await UserModel.findById({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 200 }
      );
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
