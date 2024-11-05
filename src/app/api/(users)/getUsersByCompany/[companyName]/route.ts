import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  companyName: string;
};
export async function GET(request: NextRequest, context: { params: Params }) {
  await dbConnect();
  const par = await context.params;
  const companyName = par.companyName;
  try {
    const users = await UserModel.find({ companyName });
    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, message: "No Users found" },
        { status: 200 }
      );
    }
    revalidatePath("/managerDashboard/users");
    return NextResponse.json(
      { success: true, message: "Users fetched successfully", users: users },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching Users:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching Users" },
      { status: 500 }
    );
  }
}
