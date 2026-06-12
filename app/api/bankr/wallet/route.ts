import { NextResponse } from "next/server";

import { BankrApiError } from "@/lib/bankr/client";
import { isBankrAdminRequest } from "@/lib/bankr/config";
import { getBankrWalletInfo } from "@/lib/bankr/wallet";

export async function GET(request: Request) {
  if (!isBankrAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json(await getBankrWalletInfo());
  } catch (error) {
    if (error instanceof BankrApiError) {
      return NextResponse.json(
        { message: error.message, details: error.payload },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { message: "Failed to load Bankr wallet." },
      { status: 500 },
    );
  }
}
