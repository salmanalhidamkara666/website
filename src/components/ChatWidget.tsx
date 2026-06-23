import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, Send, X } from "lucide-react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Terjadi kesalahan saat mengirim pesan.");
      } else {
        setReply(data.reply ?? "");
        setMessage("");
      }
    } catch (err) {
      setError("Gagal menghubungi server. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[320px] max-w-[90vw] rounded-3xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 rounded-t-3xl bg-primary p-4 text-white">
              <div>
                <p className="text-sm font-semibold">Chat Assistant</p>
                <p className="text-xs text-white/80">Tanya tentang program dan pendaftaran</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-white/10 p-2 hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 p-4 text-sm text-slate-700">
              <div className="rounded-3xl bg-slate-100 p-3 text-slate-900">
                {reply ?? "Ketik pertanyaanmu di bawah dan kirim."}
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSend} className="flex flex-col gap-3">
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Tanyakan tentang program, biaya, atau pendaftaran..."
                  className="min-h-[90px] w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-primary focus:bg-white"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {loading ? "Mengirim..." : "Kirim Pesan"}
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl shadow-primary/20 transition hover:bg-primary-dark"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
