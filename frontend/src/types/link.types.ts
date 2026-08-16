export type LinkStatus = "active" | "password_protected" | "expired" | "disabled";

export interface Link {
  id: string;
  workspaceId: string;
  title: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  domain: string;
  clicks: number;
  uniqueVisitors?: number;
  status: LinkStatus;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  expiresAt?: string;
  password?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  qrSettings?: {
    fgColor?: string;
    bgColor?: string;
    logoUrl?: string;
  };
}

export interface CreateLinkDto {
  title?: string;
  originalUrl: string;
  shortCode?: string;
  domain?: string;
  workspaceId?: string;
  status?: LinkStatus;
  tags?: string[];
  password?: string;
  expiresAt?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  qrSettings?: {
    fgColor?: string;
    bgColor?: string;
    logoUrl?: string;
  };
}

export interface UpdateLinkDto extends Partial<CreateLinkDto> {}

export interface LinkFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  workspaceId?: string;
  tag?: string;
  sortBy?: "createdAt" | "clicks" | "title";
  sortOrder?: "asc" | "desc";
}
