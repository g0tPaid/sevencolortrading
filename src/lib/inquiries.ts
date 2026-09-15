export const INQUIRY_KINDS = ["rfq", "visit"] as const;

export type InquiryKind = (typeof INQUIRY_KINDS)[number];

export type InquiryFileMeta = {
  filename: string;
  size: number;
  mime: string;
};

export type Inquiry = {
  id: string;
  createdAt: string;
  kind: InquiryKind;
  sourcePath: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  description?: string;
  quantity?: string;
  budget?: string;
  startDate?: string;
  duration?: string;
  travelers?: string;
  focus?: string;
  notes?: string;
  files?: InquiryFileMeta[];
};

export type CreateInquiryInput = {
  kind: InquiryKind;
  sourcePath?: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  description?: string;
  quantity?: string;
  budget?: string;
  startDate?: string;
  duration?: string;
  travelers?: string;
  focus?: string;
  notes?: string;
  files?: InquiryFileMeta[];
};

export function isInquiryKind(value: unknown): value is InquiryKind {
  return value === "rfq" || value === "visit";
}
