export type DomainVerificationStatus = "verified" | "pending" | "failed";
export type SslStatus = "active" | "provisioning" | "failed";

export interface DnsRecord {
  type: "A" | "CNAME" | "TXT";
  name: string;
  value: string;
  status: "configured" | "missing";
}

export interface Domain {
  id: string;
  workspaceId: string;
  hostname: string;
  status: DomainVerificationStatus;
  sslStatus: SslStatus;
  dnsRecords: DnsRecord[];
  isCustom: boolean;
  isDefault: boolean;
  createdAt: string;
}

export interface AddDomainDto {
  hostname: string;
  workspaceId: string;
}
