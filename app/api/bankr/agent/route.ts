import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { bankrPromptSchema, submitBankrPrompt } from "@/lib/bankr/agent";
import { BankrApiError } from "@/lib/bankr/client";
import { isBankrAdminRequest } from "@/lib/bankr/config";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "bankr-agent", 10, 60 * 1000);
  if (limited) return limited;

  if (!isBankrAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const input = bankrPromptSchema.parse(await request.json());
    return NextResponse.json(await submitBankrPrompt(input), { status: 202 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid Bankr prompt.", issues: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof BankrApiError) {
      return NextResponse.json(
        { message: error.message, details: error.payload },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { message: "Failed to submit Bankr prompt." },
      { status: 500 },
    );
  }
}
