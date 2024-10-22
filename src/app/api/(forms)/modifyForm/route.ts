import dbConnect from "@/lib/dbConnect";
import FormModel from "@/model/form";
import FilledFormModel from "@/model/filledForm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  const { companyName, formName, formItems, formItemsLength, formItemDetails } =
    await request.json();
  try {
    const existingForm = await FormModel.findOne({
      companyName,
      title: formName,
    });

    if (!existingForm) {
      return NextResponse.json(
        { success: false, message: "Form not found" },
        { status: 200 }
      );
    }
    existingForm.title = formName;
    existingForm.formItems = formItems;
    existingForm.formItemsLength = formItemsLength;
    existingForm.formItemDetails = formItemDetails;
    await existingForm.save();
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
