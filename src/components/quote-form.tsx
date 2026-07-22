'use client';

import { FormEvent, useState } from 'react';
import { BRAND, waUrl } from '@/lib/brand';

const field =
  'mt-2 w-full border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-ink';

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
    <form onSubmit={onSubmit} className="border border-line bg-paper-2 p-6 sm:p-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted">Your information</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-[11px] font-bold uppercase tracking-[0.14em]">
          Full name *
          <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className={field} />
        </label>
        <label className="block text-[11px] font-bold uppercase tracking-[0.14em]">
          Company (optional)
          <input value={company} onChange={(e) => setCompany(e.target.value)} className={field} />
        </label>
        <label className="block text-[11px] font-bold uppercase tracking-[0.14em]">
          Email *
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
        </label>
        <label className="block text-[11px] font-bold uppercase tracking-[0.14em]">
          WhatsApp / phone *
          <input required value={phone} onChange={(e) => setPhone(e.target.value)} className={field} />
        </label>
      </div>

      <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.22em] text-muted">Requirements</p>
      <label className="mt-5 block text-[11px] font-bold uppercase tracking-[0.14em]">
        Product description *
        <textarea
          required
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={field}
        />
      </label>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-[11px] font-bold uppercase tracking-[0.14em]">
          Shipping destination *
          <input required value={destination} onChange={(e) => setDestination(e.target.value)} className={field} />
        </label>
        <label className="block text-[11px] font-bold uppercase tracking-[0.14em]">
          Discount code
          <input value={discount} onChange={(e) => setDiscount(e.target.value)} className={field} />
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center bg-signal px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-ink sm:w-auto"
      >
        Send inquiry on WhatsApp
      </button>
    </form>
  );
}
