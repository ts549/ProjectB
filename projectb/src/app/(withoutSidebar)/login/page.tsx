"use client";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const googleAuth = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <header className="text-center mb-8">
        <h1 className="text-6xl font-quicksand text-white mb-4 font-semibold">
          Welcome
        </h1>
        <p className="text-lg text-muted-foreground">
          To start, choose an account to log in with
        </p>
      </header>
      <main className="w-130 h-80 p-10 border border-border rounded-lg bg-slate-800/70">
        <div className="flex gap-8">
          <button
            className="w-30 h-30 flex flex-col items-center justify-center gap-4 rounded-lg hover:bg-slate-700/50 transition-colors"
            title="Gmail"
            onClick={googleAuth}
          >
            <div className="w-15 h-15 rounded-md bg-primary/10 flex items-center justify-center overflow-hidden">
              <Image
                src="/GmailIcon.png"
                alt="Gmail"
                width={28}
                height={28}
                className="w-full h-full"
              />
            </div>
            <span className="text-xl font-medium text-white">Gmail</span>
          </button>
          <button
            className="w-30 h-30 flex flex-col items-center justify-center gap-4 rounded-lg hover:bg-slate-700/50 transition-colors"
            title="Outlook"
          >
            <div className="w-15 h-15 rounded-md bg-primary/10 flex items-center justify-center overflow-hidden">
              <Image
                src="/OutlookIcon.png"
                alt="Outlook"
                width={28}
                height={28}
                className="w-full h-full"
              />
            </div>
            <span className="text-xl font-medium text-muted-foreground">
              Outlook
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}
