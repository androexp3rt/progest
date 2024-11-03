import dbConnect from "@/lib/dbConnect";
import NotificationModel from "@/model/notification";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const notifications = await NotificationModel.find({});
    if (!notifications || notifications.length === 0) {
      return NextResponse.json(
        { success: false, message: "No Notifications found" },
        { status: 200 }
      );
    }
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Notifications fetched successfully",
        notifications,
      }),
      {
        status: 200,
        headers: {
          Connection: "keep-alive",
          "Content-Encoding": "none",
          "Cache-Control": "no-cache, no-transform",
          "Content-Type": "text/event-stream; charset=utf-8",
        },
      }
    );

    // return NextResponse.json(
    //   {
    //     success: true,
    //     message: "Notifications fetched successfully",
    //     notifications,
    //   },
    //   { status: 200 }
    // );
  } catch (error) {
    console.log("Error fetching Notifications", error);
    return NextResponse.json(
      { success: false, message: "Error fetching Notifications" },
      { status: 500 }
    );
  }
}
