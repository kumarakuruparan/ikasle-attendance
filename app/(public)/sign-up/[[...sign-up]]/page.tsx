import React from "react";
import { SignUp } from "@clerk/nextjs";
import { Layers } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center p-4 py-12">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100 mb-2.5">
          <Layers className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Join the IKASLE Workspace
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Create your employee account to start tracking presence, tasks, and daily work reports.
        </p>
      </div>

      <div className="w-full max-w-md flex justify-center">
        <SignUp
          appearance={{
            elements: {
              card: "shadow-xs border border-slate-200 rounded-xl bg-white",
              formButtonPrimary:
                "bg-blue-600 hover:bg-blue-700 text-xs font-medium rounded-lg text-white shadow-xs transition-colors",
            },
          }}
        />
      </div>
    </div>
  );
}
