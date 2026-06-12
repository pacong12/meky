"use client";

import { useState } from "react";
import {
  Bot,
  Loader2,
  Search,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/8bit/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/8bit/select";
import { bankrPromptTemplates } from "@/lib/bankr/prompts";

type ApiState = {
  status: "idle" | "loading" | "success" | "error";
  message: string;
  data?: unknown;
};

type BankrConsoleRequestInit = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

const defaultPrompt =
  "Summarize the current Bankr wallet status and suggest safe read-only next steps for Meki Adventure on Base.";

export function BankrConsole() {
  const [adminToken, setAdminToken] = useState("");
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [threadId, setThreadId] = useState("");
  const [jobId, setJobId] = useState("");
  const [state, setState] = useState<ApiState>({
    status: "idle",
    message: "Session admin aktif. Pilih action Bankr untuk mulai.",
  });

  async function callBankr(path: string, init: BankrConsoleRequestInit = {}) {
    const response = await fetch(path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        ...init.headers,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || `Request failed: ${response.status}`);
    }

    return data as unknown;
  }

  async function loadWallet() {
    setState({ status: "loading", message: "Membaca wallet Bankr..." });

    try {
      const data = await callBankr("/api/bankr/wallet");
      setState({ status: "success", message: "Wallet Bankr terbaca.", data });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Wallet request failed.",
      });
    }
  }

  async function submitPrompt() {
    setState({ status: "loading", message: "Mengirim prompt ke Bankr agent..." });

    try {
      const data = (await callBankr("/api/bankr/agent", {
        method: "POST",
        body: JSON.stringify({
          prompt,
          threadId: threadId || undefined,
        }),
      })) as { jobId?: string; threadId?: string };

      if (data.jobId) {
        setJobId(data.jobId);
      }

      if (data.threadId) {
        setThreadId(data.threadId);
      }

      setState({ status: "success", message: "Prompt diterima Bankr.", data });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Prompt request failed.",
      });
    }
  }

  async function loadJob() {
    if (!jobId) {
      setState({ status: "error", message: "Isi jobId dulu." });
      return;
    }

    setState({ status: "loading", message: "Mengambil status job..." });

    try {
      const data = await callBankr(`/api/bankr/job/${encodeURIComponent(jobId)}`);
      setState({ status: "success", message: "Job status terbaca.", data });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Job request failed.",
      });
    }
  }

  async function cancelJob() {
    if (!jobId) {
      setState({ status: "error", message: "Isi jobId dulu." });
      return;
    }

    setState({ status: "loading", message: "Membatalkan job..." });

    try {
      const data = await callBankr(`/api/bankr/job/${encodeURIComponent(jobId)}/cancel`, {
        method: "POST",
      });
      setState({ status: "success", message: "Cancel request terkirim.", data });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Cancel request failed.",
      });
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="border-4 border-[#08080d] bg-[#fff4c4] p-5 text-[#08080d] shadow-[8px_8px_0_#000]">
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-7 text-[#e63946]" />
          <h2 className="font-display text-xl font-black uppercase">Admin Session</h2>
        </div>
        <p className="mt-4 font-pixel-body text-sm font-normal leading-6 text-[#243044]">
          Console memakai session admin server-side. Field token opsional hanya
          untuk override bearer token saat debugging.
        </p>
        <details className="mt-5">
          <summary className="cursor-pointer font-display text-[10px] font-black uppercase">
            Bearer override
          </summary>
          <input
            value={adminToken}
            onChange={(event) => setAdminToken(event.target.value)}
            type="password"
            className="mt-3 w-full border-4 border-[#08080d] bg-white px-4 py-3 font-pixel-body text-sm font-normal outline-none focus:bg-[#ffd166]"
            placeholder="Optional BANKR_ADMIN_TOKEN"
          />
        </details>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button onClick={loadWallet} font="retro" variant="outline" size="lg">
            <Wallet className="size-4" />
            Wallet
          </Button>
          <Button onClick={loadJob} font="retro" variant="secondary" size="lg">
            <Search className="size-4" />
            Poll Job
          </Button>
        </div>

        <label className="mt-6 block font-display text-[10px] font-black uppercase">
          Job ID
        </label>
        <input
          value={jobId}
          onChange={(event) => setJobId(event.target.value)}
          className="mt-2 w-full border-4 border-[#08080d] bg-white px-4 py-3 font-pixel-body text-sm font-normal outline-none focus:bg-[#ffd166]"
          placeholder="job_..."
        />

        <Button
          onClick={cancelJob}
          font="retro"
          variant="destructive"
          size="lg"
          className="mt-3 w-full"
        >
          Cancel Job
        </Button>
      </section>

      <section className="border-4 border-[#08080d] bg-[#111827] p-5 shadow-[8px_8px_0_#000]">
        <div className="flex items-center gap-3">
          <Bot className="size-7 text-[#ffd166]" />
          <h2 className="font-display text-xl font-black uppercase text-[#fff4c4]">
            Agent Prompt
          </h2>
        </div>
        <label className="mt-6 block font-display text-[10px] font-black uppercase text-[#ffd166]">
          Template
        </label>
        <Select
          onValueChange={(value) => {
            const template = bankrPromptTemplates.find((item) => item.id === value);

            if (template) {
              setPrompt(template.prompt);
            }
          }}
        >
          <SelectTrigger className="mt-2 w-full">
            <SelectValue placeholder="Choose prompt template" />
          </SelectTrigger>
          <SelectContent>
            {bankrPromptTemplates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <label className="mt-6 block font-display text-[10px] font-black uppercase text-[#ffd166]">
          Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="mt-2 min-h-40 w-full border-4 border-[#08080d] bg-[#fff4c4] px-4 py-3 font-pixel-body text-sm font-normal text-[#08080d] outline-none focus:bg-white"
        />
        <label className="mt-4 block font-display text-[10px] font-black uppercase text-[#ffd166]">
          Thread ID
        </label>
        <input
          value={threadId}
          onChange={(event) => setThreadId(event.target.value)}
          className="mt-2 w-full border-4 border-[#08080d] bg-[#fff4c4] px-4 py-3 font-pixel-body text-sm font-normal text-[#08080d] outline-none focus:bg-white"
          placeholder="Optional"
        />
        <Button
          onClick={submitPrompt}
          font="retro"
          variant="default"
          size="lg"
          className="mt-5 w-full"
        >
          {state.status === "loading" ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
          Submit To Bankr
        </Button>
      </section>

      <section className="border-4 border-[#08080d] bg-[#08080d] p-5 shadow-[8px_8px_0_#000] lg:col-span-2">
        <p
          className={
            state.status === "error"
              ? "font-display text-[10px] font-black uppercase text-[#ff8a8a]"
              : "font-display text-[10px] font-black uppercase text-[#ffd166]"
          }
        >
          {state.message}
        </p>
        <pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap border-4 border-[#000] bg-[#111827] p-4 font-pixel-body text-xs leading-6 text-[#d7e7c4]">
          {state.data ? JSON.stringify(state.data, null, 2) : "No response yet."}
        </pre>
      </section>
    </div>
  );
}
