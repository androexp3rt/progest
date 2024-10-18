import dbConnect from "@/lib/dbConnect";
import FormModel from "@/model/form";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  const { id } = await request.json();
  try {
    const form = await FormModel.findById({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!form) {
      return NextResponse.json(
        { success: false, message: "Form not found" },
        { status: 200 }
      );
    }
    await form.deleteOne();
    return NextResponse.json(
      { success: true, message: "Form deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting Form:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting Form" },
      { status: 500 }
    );
  }
}
