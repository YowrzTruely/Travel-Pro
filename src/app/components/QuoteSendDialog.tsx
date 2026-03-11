import { useAction } from "convex/react";
import {
  Copy,
  ExternalLink,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { appToast } from "./AppToast";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";

type Channel = "whatsapp" | "sms" | "email";

interface QuoteSendDialogProps {
  legacyId: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  projectId: Id<"projects">;
}

export function QuoteSendDialog({
  projectId,
  legacyId,
  open,
  onOpenChange,
}: QuoteSendDialogProps) {
  const sendQuote = useAction(api.sendQuote.sendQuoteToClient);
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const quoteUrl = `${window.location.origin}/quote/${legacyId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(quoteUrl);
    appToast.success("קישור הועתק", quoteUrl);
  };

  const handleSend = async () => {
    const recipient = channel === "email" ? email : phone;

    if (!recipient.trim()) {
      appToast.error(
        "שדה חובה",
        channel === "email" ? "יש להזין כתובת אימייל" : "יש להזין מספר טלפון"
      );
      return;
    }

    setSending(true);
    try {
      const result = await sendQuote({
        projectId,
        channel,
        recipient,
      });

      if (
        result.channel === "whatsapp" &&
        "waLink" in result &&
        result.waLink
      ) {
        window.open(result.waLink, "_blank");
        appToast.success("וואטסאפ", "נפתח חלון וואטסאפ לשליחה");
        onOpenChange(false);
      } else if (result.sent) {
        appToast.success(
          "נשלח בהצלחה",
          channel === "sms" ? "ההודעה נשלחה ב-SMS" : "ההודעה נשלחה באימייל"
        );
        onOpenChange(false);
      } else {
        appToast.error("שגיאה בשליחה", result.error || "נסה שוב מאוחר יותר");
      }
    } catch (err) {
      appToast.error("שגיאה", String(err));
    } finally {
      setSending(false);
    }
  };

  const channels: { icon: React.ReactNode; key: Channel; label: string }[] = [
    {
      key: "whatsapp",
      label: "וואטסאפ",
      icon: <MessageSquare size={16} />,
    },
    { key: "sms", label: "SMS", icon: <Phone size={16} /> },
    { key: "email", label: "אימייל", icon: <Mail size={16} /> },
  ];

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="max-w-md rounded-xl border-[#e7e1da] bg-[#f8f7f5] font-['Assistant',sans-serif]"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="text-right font-bold text-[#181510] text-lg">
            שליחת הצעת מחיר ללקוח
          </DialogTitle>
        </DialogHeader>

        {/* Quote URL */}
        <div className="mt-2 rounded-xl border border-[#e7e1da] bg-white p-3">
          <p className="mb-1.5 font-semibold text-[#8d785e] text-xs">
            קישור להצעה
          </p>
          <div className="flex items-center gap-2">
            <input
              className="flex-1 truncate rounded-lg border border-[#e7e1da] bg-[#f8f7f5] px-3 py-1.5 text-[#181510] text-xs outline-none"
              readOnly
              value={quoteUrl}
            />
            <button
              className="flex items-center gap-1 rounded-lg bg-[#181510] px-3 py-1.5 text-white text-xs transition hover:bg-[#2a2518]"
              onClick={copyLink}
              type="button"
            >
              <Copy size={12} />
              העתק
            </button>
          </div>
        </div>

        {/* Channel selector */}
        <div className="mt-3">
          <p className="mb-2 font-semibold text-[#8d785e] text-xs">
            ערוץ שליחה
          </p>
          <div className="flex gap-2">
            {channels.map((ch) => (
              <button
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 font-semibold text-[13px] transition ${
                  channel === ch.key
                    ? "border-[#ff8c00] bg-[#ff8c00]/10 text-[#ff8c00]"
                    : "border-[#e7e1da] bg-white text-[#8d785e] hover:border-[#ff8c00]/40"
                }`}
                key={ch.key}
                onClick={() => setChannel(ch.key)}
                type="button"
              >
                {ch.icon}
                {ch.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input field */}
        <div className="mt-3">
          {channel === "email" ? (
            <div>
              <label
                className="mb-1 block font-semibold text-[#181510] text-sm"
                htmlFor="quote-email"
              >
                כתובת אימייל
              </label>
              <Input
                className="rounded-xl border-[#e7e1da] bg-white text-sm"
                dir="ltr"
                id="quote-email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                type="email"
                value={email}
              />
            </div>
          ) : (
            <div>
              <label
                className="mb-1 block font-semibold text-[#181510] text-sm"
                htmlFor="quote-phone"
              >
                מספר טלפון
              </label>
              <Input
                className="rounded-xl border-[#e7e1da] bg-white text-sm"
                dir="ltr"
                id="quote-phone"
                onChange={(e) => setPhone(e.target.value)}
                placeholder="050-1234567"
                type="tel"
                value={phone}
              />
            </div>
          )}
        </div>

        {/* Send button */}
        <div className="mt-4 flex gap-2">
          <Button
            className="flex-1 rounded-xl bg-[#ff8c00] font-semibold text-white hover:bg-[#e67e00]"
            disabled={sending}
            onClick={handleSend}
            type="button"
          >
            {sending ? (
              <Loader2 className="ml-2 animate-spin" size={16} />
            ) : channel === "whatsapp" ? (
              <ExternalLink className="ml-2" size={16} />
            ) : null}
            {channel === "whatsapp" ? "פתח וואטסאפ" : "שלח"}
          </Button>
          <Button
            className="rounded-xl border-[#e7e1da] text-[#8d785e]"
            onClick={() => onOpenChange(false)}
            type="button"
            variant="outline"
          >
            ביטול
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
