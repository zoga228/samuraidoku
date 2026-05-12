"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Crown, Lock, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAccountStore } from "@/store/accountStore";

const proFeatures = [
  "Premium board skins",
  "Black Ink Samurai theme",
  "Sakura Garden theme",
  "Katana Steel theme",
  "Advanced statistics",
  "Unlimited AI explanations",
  "Daily Challenge history",
  "Personal progress path"
];

export default function ProUpgradeCard({ large = false }: { large?: boolean }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { email, isPro, activatePro } = useAccountStore();

  const upgrade = async () => {
    if (isPro) {
      setMessage("Pro is active. Premium skins, Daily archive and unlimited Sensei are unlocked.");
      setOpen(true);
      return;
    }

    if (!email) {
      setOpen(true);
      return;
    }

    setLoading(true);
    setMessage("");
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });
    const data = (await response.json()) as { url?: string; mock?: boolean; message?: string; error?: string };

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    if (data.mock) {
      activatePro();
      setMessage(data.message ?? "Demo Pro activated.");
    } else {
      setMessage(data.error ?? "Checkout is unavailable.");
    }

    setLoading(false);
    setOpen(true);
  };

  return (
    <>
      <article className="paper-panel rounded-md p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase text-ink-700">Monetization</p>
            <h3 className="font-serif text-3xl font-semibold text-ink-900">Upgrade to Pro</h3>
          </div>
          <div className="rounded-full bg-ink-900 p-3 text-parchment-100">
            <Crown size={22} />
          </div>
        </div>
        <p className="text-sm leading-6 text-ink-700">
          Unlock premium skins, deeper statistics and the Sensei AI Coach for serious training.
        </p>
        <div className={`mt-5 grid gap-2 ${large ? "sm:grid-cols-2" : ""}`}>
          {proFeatures.slice(0, large ? proFeatures.length : 4).map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-sm text-ink-800">
              <Check size={16} className="text-success" /> {feature}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={upgrade}
          className="focus-ring mt-6 w-full rounded-full bg-ink-900 px-5 py-3 font-semibold text-parchment-100 transition hover:bg-ink-800"
        >
          {loading ? "Opening checkout..." : isPro ? "Manage Pro" : "Upgrade to Pro"}
        </button>
      </article>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] grid place-items-center bg-ink-900/55 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              className="paper-panel w-full max-w-md rounded-md p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase text-ink-700">{email ? "Checkout" : "Login required"}</p>
                  <h3 className="font-serif text-3xl font-semibold">{isPro ? "Pro activated" : "Samuraidoku Pro"}</h3>
                </div>
                <button
                  type="button"
                  aria-label="Close checkout"
                  title="Close checkout"
                  onClick={() => setOpen(false)}
                  className="focus-ring rounded-full border border-ink-900/15 p-2"
                >
                  <X size={18} />
                </button>
              </div>
              {email ? (
                <>
                  <p className="mt-5 rounded-md bg-parchment-50/75 p-4 text-sm leading-6 text-ink-700">
                    {message ||
                      "Stripe Checkout is prepared. Add STRIPE_SECRET_KEY and STRIPE_PRO_PRICE_ID to enable real payments."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="focus-ring mt-5 w-full rounded-full bg-ink-900 px-5 py-3 font-semibold text-parchment-100"
                  >
                    Continue
                  </button>
                </>
              ) : (
                <>
                  <p className="mt-5 flex gap-2 rounded-md bg-parchment-50/75 p-4 text-sm leading-6 text-ink-700">
                    <Lock className="mt-0.5 shrink-0" size={18} />
                    Log in first. Pro controls the Sensei AI Coach and premium training features.
                  </p>
                  <Link
                    href="/login"
                    className="focus-ring mt-5 inline-flex w-full justify-center rounded-full bg-ink-900 px-5 py-3 font-semibold text-parchment-100"
                  >
                    Go to login
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
