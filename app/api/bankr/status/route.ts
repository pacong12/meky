import { NextResponse } from "next/server";

import { getAdminToken } from "@/lib/admin/access";
import { isBankrConfigured } from "@/lib/bankr/config";

export async function GET() {
  return NextResponse.json({
    configured: isBankrConfigured(),
    adminConfigured: Boolean(getAdminToken()),
  });
}
