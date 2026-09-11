export const APPLICATION_STATUSES = ["pending", "contacted", "approved", "rejected"] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const EXPORT_EXPERIENCE = ["none", "some", "established"] as const;

export type ExportExperience = (typeof EXPORT_EXPERIENCE)[number];

export type FactoryApplication = {
  id: string;
  createdAt: string;
  status: ApplicationStatus;
  sourcePath: string;
  companyNameEn: string;
  companyNameZh?: string;
  contactName: string;
  phone: string;
  wechat?: string;
  email: string;
  city: string;
  province: string;
  categories: string[];
  moq?: string;
  exportExperience?: ExportExperience;
  licenseNumber?: string;
  alibabaOrWebsite?: string;
  notes?: string;
};

export type CreateApplicationInput = {
  companyNameEn: string;
  companyNameZh?: string;
  contactName: string;
  phone: string;
  wechat?: string;
  email: string;
  city: string;
  province: string;
  categories: string[];
  moq?: string;
  exportExperience?: ExportExperience;
  licenseNumber?: string;
  alibabaOrWebsite?: string;
  notes?: string;
  sourcePath?: string;
};

export function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return typeof value === "string" && (APPLICATION_STATUSES as readonly string[]).includes(value);
}

export function isExportExperience(value: unknown): value is ExportExperience {
  return typeof value === "string" && (EXPORT_EXPERIENCE as readonly string[]).includes(value);
}
