import { NextResponse } from "next/server";
import { db } from "@/lib/database";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await requireSuperAdmin();

    const body = await req.json();
    if (typeof body.maintenanceMode !== "boolean") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const updated = await db.updateMaintenanceMode(body.maintenanceMode);
    
    // Log admin activity
    await prisma.adminActivity.create({
      data: {
        userId: user.id,
        action: body.maintenanceMode ? "Mengaktifkan Maintenance Mode" : "Menonaktifkan Maintenance Mode",
      }
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
