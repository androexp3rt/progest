import dbConnect from "@/lib/dbConnect";
import FilledFormModel from "@/model/filledForm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  const { title, formItemDetails, formState, companyName, filledBy } =
    await request.json();
  try {
    const newForm = new FilledFormModel({
      companyName,
      title,
      formState,
      formItemDetails,
      filledBy,
    });
    await newForm.save();
    return NextResponse.json(
      { success: true, message: "Form Saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error saving form :", error);
    return NextResponse.json(
      { success: false, message: "Error saving Form" },
      { status: 500 }
    );
  }
}
