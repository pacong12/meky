import { z } from "zod";

import { bankrRequest } from "./client";

export const bankrPromptSchema = z.object({
  prompt: z.string().trim().min(3).max(10_000),
  threadId: z.string().trim().min(1).max(200).optional(),
  maxMode: z
    .object({
      enabled: z.boolean(),
      model: z.enum([
        "claude-opus-4.6",
        "claude-sonnet-4.6",
        "gemini-3.1-pro",
      ]),
    })
    .optional(),
});

export const bankrJobIdSchema = z.object({
  jobId: z.string().trim().min(1).max(200),
});

export type BankrPromptInput = z.infer<typeof bankrPromptSchema>;

export type BankrJobStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export type BankrPromptResponse = {
  success: boolean;
  jobId: string;
  threadId?: string;
  status: BankrJobStatus;
  message?: string;
};

export type BankrJobResponse = {
  success: boolean;
  jobId: string;
  threadId?: string;
  status: BankrJobStatus;
  prompt?: string;
  createdAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  processingTime?: number;
  response?: string;
  richData?: unknown[];
  error?: string;
  cancellable?: boolean;
};

export function submitBankrPrompt(input: BankrPromptInput) {
  return bankrRequest<BankrPromptResponse>("/agent/prompt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

export function getBankrJob(jobId: string) {
  return bankrRequest<BankrJobResponse>(`/agent/job/${encodeURIComponent(jobId)}`);
}

export function cancelBankrJob(jobId: string) {
  return bankrRequest<BankrJobResponse>(
    `/agent/job/${encodeURIComponent(jobId)}/cancel`,
    {
      method: "POST",
    },
  );
}
