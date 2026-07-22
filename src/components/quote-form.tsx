'use client';

import { FormEvent, useState } from 'react';
import { BRAND, waUrl } from '@/lib/brand';

const inputClass =
  'mt-2 w-full rounded-2xl border border-line bg-paper px-4 py-3 text-sm outline-none ring-accent/30 placeholder:text-muted/70 focus:ring-2';

export function QuoteForm() {
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [destination, setDestination] = useState('');
  const [discount, setDiscount] = useState('');

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const lines = [
      `Hi Seven Color — quote request from ${BRAND.domain}`,
      '',
      `Name: ${fullName}`,
      company ? `Company: ${company}` : null,
      `Email: ${email}`,
      `WhatsApp / Phone: ${phone}`,
      `Destination: ${destination}`,
      discount ? `Discount code: ${discount}` : null,
      '',
      'Product requirements:',
      description,
    ]
      .filter(Boolean)
      .join('\n');
    window.open(waUrl(lines), '_blank', 'noopener,noreferrer');
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[32px] border border-line bg-white/80 p-6 shadow-[0_20px_60px_rgba(11,18,32,0.06)] sm:p-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">Your information</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-[12px] font-semibold tracking-[0.06em]">
          Full name *
          <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-[12px] font-semibold tracking-[0.06em]">
          Company name (optional)
          <input value={company} onChange={(e) => setCompany(e.target.value)} className={inputClass} />
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
          WhatsApp / phone *
          <input required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
        </label>
      </div>

      <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
        Product requirements
      </p>
      <label className="mt-5 block text-[12px] font-semibold tracking-[0.06em]">
        Product description *
        <textarea
          required
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="The more details you provide, the more accurate our quote will be."
          className={inputClass}
        />
      </label>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-[12px] font-semibold tracking-[0.06em]">
          Shipping destination *
          <input
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-[12px] font-semibold tracking-[0.06em]">
          Discount code (optional)
          <input value={discount} onChange={(e) => setDiscount(e.target.value)} className={inputClass} />
        </label>
      </div>

      <p className="mt-5 text-xs leading-5 text-muted">
        Privacy note: your information is used solely for processing your quote request. We never
        share your details with third parties without permission.
      </p>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:brightness-110 sm:w-auto"
      >
        Send inquiry on WhatsApp
      </button>
      <p className="mt-3 text-xs text-muted">You&apos;ll receive a response within 24 hours.</p>
    </form>
  );
}
