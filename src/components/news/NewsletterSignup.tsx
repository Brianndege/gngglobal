"use client";

import { FormEvent, useMemo, useState } from "react";
import { getCmsApiBaseUrl } from "@/lib/cms";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = useMemo(() => getCmsApiBaseUrl(), []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!consent) {
      setError("Please confirm consent to receive updates.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/newsletter/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          consent: String(consent),
          source: "news-page",
          website,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(data?.message || "Subscription failed. Please try again.");
      }

      setMessage("Thanks for subscribing. You’ll receive future insights and updates.");
      setEmail("");
      setConsent(false);
      setWebsite("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Subscription failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter your email address"
        className="flex-1 px-6 py-4 rounded-md text-navy-900 font-inter focus:outline-none focus:ring-2 focus:ring-gold"
      />

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        className="hidden"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-8 py-4 bg-gold hover:bg-gold-600 text-navy-900 font-inter font-semibold rounded-md transition-all duration-300 hover:shadow-xl whitespace-nowrap disabled:opacity-60"
      >
        {isSubmitting ? "Subscribing..." : "Subscribe Now"}
      </button>

      <div className="sm:basis-full sm:order-3 text-left">
        <label className="inline-flex items-start gap-2 text-sm text-ivory-200 mt-1">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-1"
          />
          <span>I agree to receive updates and understand I can unsubscribe at any time.</span>
        </label>

        {message && <p className="text-emerald-300 text-sm mt-2">{message}</p>}
        {error && <p className="text-red-300 text-sm mt-2">{error}</p>}
      </div>
    </form>
  );
}
