'use client';

import { FormEvent, useState } from 'react';
import { BRAND, waUrl } from '@/lib/brand';

const field =
  'mt-2 w-full border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-ink';

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
    <form onSubmit={onSubmit} className="border border-line bg-paper-2 p-6 sm:p-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted">Message</p>
      <div className="mt-5 grid gap-4">
        <label className="block text-[11px] font-bold uppercase tracking-[0.14em]">
          Your name *
          <input required value={name} onChange={(e) => setName(e.target.value)} className={field} />
        </label>
        <label className="block text-[11px] font-bold uppercase tracking-[0.14em]">
          Email *
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
        </label>
        <label className="block text-[11px] font-bold uppercase tracking-[0.14em]">
          Subject *
          <input required value={subject} onChange={(e) => setSubject(e.target.value)} className={field} />
        </label>
        <label className="block text-[11px] font-bold uppercase tracking-[0.14em]">
          Message *
          <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className={field} />
        </label>
      </div>
      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center bg-ink px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-paper transition hover:bg-signal"
      >
        Send on WhatsApp
      </button>
    </form>
  );
}
