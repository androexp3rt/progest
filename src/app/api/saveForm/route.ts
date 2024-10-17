import dbConnect from "@/lib/dbConnect";
import FormModel from "@/model/form";
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
      const newForm = new FormModel({
        companyName,
        title: formName,
        formItems,
        formItemsLength,
        formItemDetails,
      });
      await newForm.save();
      return NextResponse.json(
        { success: true, message: "Form Saved successfully" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Form name already exists" },
      { status: 400 }
    );
  } catch (error) {
    console.log("Error saving form :", error);
    return NextResponse.json(
      { success: false, message: "Error saving Form" },
      { status: 500 }
    );
  }
}
