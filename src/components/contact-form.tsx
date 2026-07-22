'use client';

import { FormEvent, useState } from 'react';
import { BRAND, waUrl } from '@/lib/brand';

const inputClass =
  'mt-2 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm outline-none ring-accent/30 placeholder:text-muted/70 focus:ring-2';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const text = [
      `Hi Seven Color — contact from ${BRAND.domain}`,
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      '',
      message,
    ].join('\n');
    window.open(waUrl(text), '_blank', 'noopener,noreferrer');
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[32px] border border-line bg-white/80 p-6 sm:p-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">Send us a message</p>
      <div className="mt-5 grid gap-4">
        <label className="block text-[12px] font-semibold tracking-[0.06em]">
          Your name *
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-[12px] font-semibold tracking-[0.06em]">
          Email address *
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-[12px] font-semibold tracking-[0.06em]">
          Subject *
          <input required value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-[12px] font-semibold tracking-[0.06em]">
          Message *
          <textarea
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={inputClass}
          />
        </label>
      </div>
      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-ink-soft"
      >
        Send on WhatsApp
      </button>
    </form>
  );
}
