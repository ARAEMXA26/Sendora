import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sistemWebsite } from "@/lib/sistem-website";

export async function GET() {
  const groups = await prisma.targetGroup.findMany();
  return NextResponse.json({ groups });
}