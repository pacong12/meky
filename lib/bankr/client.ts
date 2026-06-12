import { BANKR_API_BASE_URL, BANKR_API_KEY } from "./config";

export class BankrApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly payload?: unknown,
  ) {
    super(message);
    this.name = "BankrApiError";
  }
}

type BankrRequestInit = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

export async function bankrRequest<T>(
  path: string,
  init: BankrRequestInit = {},
): Promise<T> {
  if (!BANKR_API_KEY) {
    throw new BankrApiError("BANKR_API_KEY is not configured.", 500);
  }

  const response = await fetch(`${BANKR_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "X-API-Key": BANKR_API_KEY,
      ...init.headers,
    },
    cache: "no-store",
  });

  const text = await response.text();
  const payload = text ? safelyParseJson(text) : null;

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : `Bankr request failed with status ${response.status}.`;

    throw new BankrApiError(message, response.status, payload);
  }

  return payload as T;
}

function safelyParseJson(text: string) {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { raw: text };
  }
}
