import dbConnect from "@/lib/dbConnect";
import FilledFormModel from "@/model/filledForm";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = true;

type Params = {
  formName: string;
  companyName: string;
};
export async function GET(request: NextRequest, context: { params: Params }) {
  await dbConnect();
  const formName = context.params.formName;
  const companyName = context.params.companyName;
  try {
    let forms;
    if (companyName === "fsalyda") {
      forms = await FilledFormModel.find({ title: formName });
    } else {
      forms = await FilledFormModel.find({ title: formName, companyName });
    }
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
