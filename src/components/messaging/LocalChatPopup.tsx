import { useEffect, useMemo, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "me" | "them";
  text: string;
  timestamp: string;
};

interface LocalChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  threadId: string;
  recipientName: string;
  contextLabel?: string;
}

const storageKey = (threadId: string) => `uottawa-local-chat:${threadId}`;

export function LocalChatPopup({
  isOpen,
  onClose,
  threadId,
  recipientName,
  contextLabel,
}: LocalChatPopupProps) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const raw = localStorage.getItem(storageKey(threadId));
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as ChatMessage[];
        setMessages(parsed);
      } catch {
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
  }, [isOpen, threadId]);

  useEffect(() => {
    if (!isOpen) return;
    localStorage.setItem(storageKey(threadId), JSON.stringify(messages));
  }, [messages, isOpen, threadId]);

  const send = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    const now = new Date().toISOString();
    setMessages((prev) => [
      ...prev,
      { id: `me-${now}`, role: "me", text: trimmed, timestamp: now },
    ]);
    setDraft("");

    // Demo auto-reply (local only)
    setTimeout(() => {
      const replyTime = new Date().toISOString();
      setMessages((prev) => [
        ...prev,
        {
          id: `them-${replyTime}`,
          role: "them",
          text: "Thanks for reaching out! Happy to share more details.",
          timestamp: replyTime,
        },
      ]);
    }, 700);
  };

  const headerLabel = useMemo(() => {
    if (!contextLabel) return recipientName;
    return `${recipientName} · ${contextLabel}`;
  }, [recipientName, contextLabel]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[320px] overflow-hidden rounded-2xl border bg-background shadow-xl">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <MessageCircle className="h-4 w-4 text-primary" />
          {headerLabel}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-muted-foreground hover:bg-muted"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="max-h-72 space-y-3 overflow-y-auto px-4 py-3 text-sm">
        {messages.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Local-only chat demo. Messages stay in this browser.
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "me" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-3 py-2",
                  message.role === "me"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                {message.text}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="border-t px-4 py-3">
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write a message..."
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <button
            type="button"
            onClick={send}
            className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
