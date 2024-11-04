import dbConnect from "@/lib/dbConnect";
import FormModel from "@/model/form";
import { NextResponse } from "next/server";

export const revalidate = 1;

export async function GET() {
  await dbConnect();
  try {
    let forms = await FormModel.find({});
    if (!forms || forms.length === 0) {
      return NextResponse.json(
        { success: false, message: "No Forms found" },
        { status: 200 }
      );
    }
    forms = forms.toSorted((a, b) =>
      a.companyName.localeCompare(b.companyName)
    );
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
