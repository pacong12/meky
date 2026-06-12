import { NextResponse } from "next/server";

import { bankrJobIdSchema, cancelBankrJob } from "@/lib/bankr/agent";
import { BankrApiError } from "@/lib/bankr/client";
import { isBankrAdminRequest } from "@/lib/bankr/config";

type JobRouteContext = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function POST(request: Request, context: JobRouteContext) {
  if (!isBankrAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { jobId } = bankrJobIdSchema.parse(await context.params);
    return NextResponse.json(await cancelBankrJob(jobId));
  } catch (error) {
    if (error instanceof BankrApiError) {
      return NextResponse.json(
        { message: error.message, details: error.payload },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { message: "Failed to cancel Bankr job." },
      { status: 500 },
    );
  }
}
