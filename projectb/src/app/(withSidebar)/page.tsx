"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { User, UserCircle, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import data from "../data.json";
// Add a utility class for hiding scrollbars
const hideScrollbar = "scrollbar-hide";

export default function Home() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [updatesToShow, setUpdatesToShow] = useState(3);
  const [activeAccount, setActiveAccount] = useState(0);
  const [emails, setEmails] = useState(data);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([
    "Hello! How can I help you today?",
    "Can you show me my recent emails?",
    "Sure! Here are your latest emails.",
  ]);

  const updates = [
    "X has reported an issue.",
    "Promotional emails from A, B, C.",
    "2 new security alerts.",
    "Weekly summary is available.",
    "Your storage is almost full.",
    "New login from an unknown device.",
    "Team meeting scheduled for Friday.",
  ];

  const accounts = [
    { name: "Account 1", icon: User },
    { name: "Account 2", icon: UserCircle },
    { name: "Account 3", icon: User2 },
  ];

  // Example notification counters for each account
  const counters = [2, 0, 5];

  function setRead(id: string) {
    setEmails((prev) =>
      prev.map((email) =>
        email.id === id ? { ...email, is_read: true } : email
      )
    );
    setSelectedEmailId(id);
  }

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    setLoading(false);
  }, [session, status]);

  if (loading) {
    return (
      <div className="h-screen w-screen absolute not-visited:flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <Skeleton className="w-24 h-24 mb-4" />
        <span className="text-lg text-muted-foreground animate-pulse">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-background text-foreground">
      {/* Emails List */}
      <section
        className={`flex-1 max-w-md min-w-[300px] border-r border-border bg-slate-800/70 text-foreground overflow-y-auto ${hideScrollbar}`}
      >
        <div className="p-3 font-semibold border-b border-border flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Toggle sidebar"
          >
            <SidebarTrigger className="-ml-1 scale-140" />
          </Button>
          <Separator
            orientation="vertical"
            className="mx-1 data-[orientation=vertical]:h-6"
          ></Separator>
          <input
            type="text"
            placeholder="Search emails..."
            className="ml-1 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {/* Account Switcher */}
        <div className="flex justify-start gap-[10px] px-4 py-2 bg-transparent mt-3">
          {accounts.map((account, idx) => {
            const Icon = account.icon;
            return (
              <div key={account.name} className="relative">
                <button
                  onClick={() => setActiveAccount(idx)}
                  className={`rounded-full border-2 transition-colors flex items-center justify-center w-7 h-7
                    ${
                      activeAccount === idx
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background"
                    }`}
                  title={account.name}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      activeAccount === idx
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
                {counters[idx] > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full border border-white">
                    {counters[idx]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <section className="px-4 py-2 text-sm text-muted-foreground">
          <div className="font-semibold mb-1">Updates since last viewed:</div>
          <ul className="list-disc list-inside space-y-1">
            {updates.slice(0, updatesToShow).map((update, idx) => (
              <li key={idx}>{update}</li>
            ))}
          </ul>
          <div className="flex gap-4 mt-2">
            {updatesToShow < updates.length && (
              <button
                className="text-xs text-primary underline hover:no-underline focus:outline-none"
                onClick={() =>
                  setUpdatesToShow((prev) => Math.min(prev + 3, updates.length))
                }
              >
                Show More
              </button>
            )}
            {updatesToShow > 3 && (
              <button
                className="text-xs text-primary underline hover:no-underline focus:outline-none"
                onClick={() => setUpdatesToShow(3)}
              >
                Show Less
              </button>
            )}
          </div>
        </section>
        <ul className="divide-y divide-border">
          {emails.map((email) => (
            <li
              key={email.id}
              className="flex items-start gap-3 p-4 hover:bg-muted cursor-pointer pl-5"
              onClick={() => setRead(email.id)}
            >
              {/* Blue dot for unread, always reserve space for alignment */}
              <div className="flex items-center min-w-[18px] justify-center">
                {email.is_read === false ? (
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 block"></span>
                ) : (
                  <span className="w-2 h-2 mr-2 block" />
                )}
                {/* Profile picture circle icon */}
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-400 flex items-center justify-center text-white font-bold text-lg">
                  {email.sender_id?.[0]?.toUpperCase() || "?"}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-base truncate max-w-[60%]">
                    {email.subject}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                    {email.date_sent
                      ? new Date(email.date_sent).toLocaleDateString()
                      : ""}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground truncate max-w-full">
                  {email.body_text}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
      {/* View Section */}
      <section
        className={`flex-1 bg-slate-700/60 text-popover-foreground overflow-y-auto ${hideScrollbar}`}
      >
        <div className="p-8">
          {selectedEmailId ? (
            (() => {
              const email = emails.find((e) => e.id === selectedEmailId);
              if (!email) return null;
              return (
                <>
                  <h2 className="text-2xl font-bold mb-4">{email.subject}</h2>
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: email.body_html }}
                  />
                </>
              );
            })()
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">Email View</h2>
              <p className="text-base text-muted-foreground">
                Select an email to view its content here.
              </p>
            </>
          )}
        </div>
      </section>
      {/* Chat Box */}
      <div className="fixed bottom-4 right-4 z-50 w-80 max-w-[90vw] flex flex-col items-end">
        {/* Outer box expands vertically on hover, always has padding */}
        <div className="relative w-full transition-all duration-300 ease-in-out h-12.5 hover:h-80 group bg-slate-900 border border-border rounded-t-lg rounded-b-lg shadow-lg overflow-hidden flex flex-col justify-end p-[5px]">
          {/* Chat history, only visible when expanded */}
          <div className="flex-1 px-2 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out pointer-events-none group-hover:pointer-events-auto whitespace-pre-line break-words">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className="mb-2 text-sm text-foreground/80">
                {msg}
              </div>
            ))}
          </div>
          {/* Inner box: chat input, always at the bottom, centered with padding */}
          <div className="w-full flex justify-center items-center">
            <form
              className="flex items-center gap-2 bg-white rounded-lg shadow px-4 py-2 w-full"
              style={{ boxSizing: "border-box" }}
              onSubmit={(e) => {
                e.preventDefault();
                if (chatInput.trim()) {
                  setChatHistory((prev) => [...prev, chatInput]);
                  setChatInput("");
                }
              }}
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-transparent outline-none text-sm px-2 text-black placeholder:text-gray-500"
              />
              <button
                type="submit"
                className="px-3 py-1 rounded bg-slate-700 text-white text-xs font-medium hover:bg-slate-600 transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
