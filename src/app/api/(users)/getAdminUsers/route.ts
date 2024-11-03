import dbConnect from "@/lib/dbConnect";
import AdminModel from "@/model/admin";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    let users = await AdminModel.find({});
    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, message: "No Admins found" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: true, message: "Admins fetched successfully", admins: users },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching Admins:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching Admins" },
      { status: 500 }
    );
  }
}
