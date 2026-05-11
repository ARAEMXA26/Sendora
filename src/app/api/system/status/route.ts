import { NextResponse } from "next/server";
import { db } from "@/lib/database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await db.getSystemSettings();
    return NextResponse.json({ maintenanceMode: settings.maintenanceMode });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
