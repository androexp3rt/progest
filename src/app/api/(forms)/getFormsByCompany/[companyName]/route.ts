import dbConnect from "@/lib/dbConnect";
import FormModel from "@/model/form";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  companyName: string;
};
export async function GET(request: NextRequest, context: { params: Params }) {
  await dbConnect();
  const companyName = context.params.companyName;
  try {
    const forms = await FormModel.find({ companyName });
    if (!forms || forms.length === 0) {
      return NextResponse.json(
        { success: false, message: "No Forms found" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: true, message: "Forms fetched successfully", forms: forms },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching Forms:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching Forms" },
      { status: 500 }
    );
  }
}
