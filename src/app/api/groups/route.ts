import { requireUser } from "@/lib/auth";
import { db } from "@/lib/database";
import { fail, ok } from "@/lib/http";
import { sistemWebsite } from "@/lib/sistem-website";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireUser();
    return ok({ groups: await db.listGroups(user.id) });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unauthorized", 401);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = (await request.json()) as {
      name?: string;
      source?: "MANUAL" | "FETCH_ALL";
    };
    const name = body.name?.trim();
    const source = body.source ?? "MANUAL";

    if (source === "FETCH_ALL") {
      const realGroups = await sistemWebsite.telegramService.fetchGroups(
        user.id,
      );

      const existingGroups = await prisma.targetGroup.findMany({
        where: { userId: user.id },
        select: { providerGroupId: true }
      });
      const existingIds = new Set(existingGroups.map(g => g.providerGroupId).filter(Boolean));

      const newGroups = realGroups.filter(g => {
        // Skip duplicate ids
        if (g.id && existingIds.has(g.id.toString())) {
          return false;
        }
        return true;
      });

      if (newGroups.length === 0) {
        return fail("Semua grup sudah ditambahkan/disinkronisasi", 400);
      }

      const created = await Promise.all(
        newGroups.map((g) =>
          db.insertGroup(user.id, g.title, "FETCH_ALL", g.photoUrl, g.memberCount, g.onlineCount, g.id?.toString()),
        ),
      );
      return ok({ groups: created }, 201);
    }

    if (!name) {
      return fail("Nama group wajib diisi", 400);
    }

    let finalName = name;
    let providerGroupId = null;
    let photoUrl = null;
    let memberCount = null;
    let onlineCount = null;
    try {
       const info = await sistemWebsite.telegramService.getGroupInfo(user.id, name);
       if (info) {
          finalName = info.title;
          providerGroupId = info.id?.toString() || null;
          photoUrl = info.photoUrl || null;
          memberCount = info.memberCount ?? null;
          onlineCount = info.onlineCount ?? null;
       }
    } catch(e: any) {
       console.error("GET_GROUP_INFO_FAILED", e);
    }

    // Check duplicate by providerGroupId if available, fallback to exact string match
    if (providerGroupId) {
      const existsById = await prisma.targetGroup.findFirst({
        where: { userId: user.id, providerGroupId },
      });
      
      if (existsById) {
        return fail("Grup sudah ditambahkan", 400);
      }
    } else {
      const existsByName = await prisma.targetGroup.findFirst({
        where: { userId: user.id, namaGrup: finalName },
      });
      
      if (existsByName) {
        return fail("Grup sudah ditambahkan", 400);
      }
    }

    const group = await db.insertGroup(user.id, finalName, source, photoUrl, memberCount, onlineCount, providerGroupId);
    return ok({ group }, 201);
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Gagal menambah group",
      400,
    );
  }
}

export async function DELETE() {
  try {
    const user = await requireUser();
    const deletedCount = await db.deleteAllGroups(user.id);
    return ok({ ok: true, deletedCount });
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Gagal menghapus semua group",
      400,
    );
  }
}
