import dbConnect from "@/lib/dbConnect";
import FilledFormModel from "@/model/filledForm";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  const { id } = await request.json();
  try {
    const form = await FilledFormModel.findById({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!form) {
      return NextResponse.json(
        { success: false, message: "Record not found" },
        { status: 200 }
      );
    }
    await form.deleteOne();
    return NextResponse.json(
      { success: true, message: "Record deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting Record:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting Record" },
      { status: 500 }
    );
  }
}
