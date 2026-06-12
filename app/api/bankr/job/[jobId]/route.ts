import { NextResponse } from "next/server";

import { getBankrJob, bankrJobIdSchema } from "@/lib/bankr/agent";
import { BankrApiError } from "@/lib/bankr/client";
import { isBankrAdminRequest } from "@/lib/bankr/config";

type JobRouteContext = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function GET(request: Request, context: JobRouteContext) {
  if (!isBankrAdminRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { jobId } = bankrJobIdSchema.parse(await context.params);
    return NextResponse.json(await getBankrJob(jobId));
  } catch (error) {
    if (error instanceof BankrApiError) {
      return NextResponse.json(
        { message: error.message, details: error.payload },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { message: "Failed to load Bankr job." },
      { status: 500 },
    );
  }
}
