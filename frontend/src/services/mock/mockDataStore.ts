import {
  Link,
  CreateLinkDto,
  UpdateLinkDto,
  LinkFilterParams,
  PaginatedResponse,
  AnalyticsSummary,
  ClickPoint,
  GeoStat,
  DeviceStat,
  BrowserStat,
  ReferrerStat,
  LiveClick,
  Workspace,
  WorkspaceMember,
  Domain,
  Subscription,
  Invoice,
  NotificationItem,
  User,
} from "@/types";

// In-memory persistent mock state for development
const initialUser: User = {
  id: "usr_1",
  name: "Alex Vance",
  email: "alex.vance@acme.inc",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  bio: "Growth Lead & Marketing Engineer at Acme Inc.",
  role: "OWNER",
  twoFactorEnabled: true,
  createdAt: "2026-01-10T00:00:00.000Z",
};

const initialWorkspaces: Workspace[] = [
  {
    id: "ws_main",
    name: "Acme Production",
    slug: "acme-prod",
    plan: "pro",
    currentUserRole: "OWNER",
    membersCount: 4,
    linksCount: 6,
    createdAt: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "ws_personal",
    name: "Personal Workspace",
    slug: "alex-personal",
    plan: "starter",
    currentUserRole: "OWNER",
    membersCount: 1,
    linksCount: 2,
    createdAt: "2026-02-01T00:00:00.000Z",
  },
];

const initialMembers: WorkspaceMember[] = [
  {
    id: "mem_1",
    workspaceId: "ws_main",
    user: initialUser,
    role: "OWNER",
    joinedAt: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "mem_2",
    workspaceId: "ws_main",
    user: {
      id: "usr_2",
      name: "Sarah Chen",
      email: "sarah.chen@acme.inc",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      role: "ADMIN",
      createdAt: "2026-02-01T00:00:00.000Z",
    },
    role: "ADMIN",
    joinedAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "mem_3",
    workspaceId: "ws_main",
    user: {
      id: "usr_3",
      name: "Marcus Vance",
      email: "marcus.v@acme.inc",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      role: "MEMBER",
      createdAt: "2026-03-10T00:00:00.000Z",
    },
    role: "MEMBER",
    joinedAt: "2026-03-10T00:00:00.000Z",
  },
];

let linksDatabase: Link[] = [
  {
    id: "lnk_101",
    workspaceId: "ws_main",
    title: "Summer Product Launch 2026",
    originalUrl: "https://acme.inc/campaigns/summer-2026-exclusive-launch?utm_source=twitter",
    shortCode: "summer26",
    shortUrl: "ly.nk/summer26",
    domain: "ly.nk",
    clicks: 14280,
    uniqueVisitors: 9840,
    status: "active",
    tags: ["Marketing", "Campaign"],
    createdAt: "2026-08-01T10:00:00.000Z",
    utmSource: "twitter",
    utmCampaign: "summer26",
  },
  {
    id: "lnk_102",
    workspaceId: "ws_main",
    title: "Q3 Developer Documentation Portal",
    originalUrl: "https://docs.acme.inc/v3/getting-started/quickstart-guide",
    shortCode: "docs-q3",
    shortUrl: "ly.nk/docs-q3",
    domain: "ly.nk",
    clicks: 9840,
    uniqueVisitors: 6200,
    status: "active",
    tags: ["Docs", "Engineering"],
    createdAt: "2026-08-03T14:30:00.000Z",
  },
  {
    id: "lnk_103",
    workspaceId: "ws_main",
    title: "Pro Annual Discount Promo 40% Off",
    originalUrl: "https://acme.inc/pricing?discount=pro40annual",
    shortCode: "pro-40off",
    shortUrl: "ly.nk/pro-40off",
    domain: "ly.nk",
    clicks: 24510,
    uniqueVisitors: 17200,
    status: "active",
    tags: ["Sales", "Promo"],
    createdAt: "2026-08-05T09:15:00.000Z",
    utmSource: "newsletter",
    utmCampaign: "discount40",
  },
  {
    id: "lnk_104",
    workspaceId: "ws_main",
    title: "Seed Investor Pitch Deck Confidential",
    originalUrl: "https://pitch.com/v/acme-seed-round-deck-2026",
    shortCode: "yc-deck",
    shortUrl: "link.dev/yc-deck",
    domain: "link.dev",
    clicks: 3120,
    uniqueVisitors: 1400,
    status: "password_protected",
    password: "secretpassword123",
    tags: ["Fundraising", "Confidential"],
    createdAt: "2026-08-08T11:00:00.000Z",
  },
  {
    id: "lnk_105",
    workspaceId: "ws_main",
    title: "Flash Webinar Registration: Microservices at Scale",
    originalUrl: "https://zoom.us/webinar/register/WN_893240294",
    shortCode: "webinar-flash",
    shortUrl: "go.bio/webinar-flash",
    domain: "go.bio",
    clicks: 4320,
    uniqueVisitors: 3100,
    status: "expired",
    expiresAt: "2026-08-10T18:00:00.000Z",
    tags: ["Webinar", "Events"],
    createdAt: "2026-08-02T16:00:00.000Z",
  },
  {
    id: "lnk_106",
    workspaceId: "ws_main",
    title: "Next.js 15 Starter Kit Github Repo",
    originalUrl: "https://github.com/vercel/next.js/releases/tag/v15.0.0",
    shortCode: "v2.4",
    shortUrl: "ly.nk/v2.4",
    domain: "ly.nk",
    clicks: 8190,
    uniqueVisitors: 5400,
    status: "active",
    tags: ["OpenSource", "Dev"],
    createdAt: "2026-08-09T08:00:00.000Z",
  },
];

let domainsDatabase: Domain[] = [
  {
    id: "dom_1",
    workspaceId: "ws_main",
    hostname: "go.acme.inc",
    status: "verified",
    sslStatus: "active",
    isCustom: true,
    isDefault: true,
    dnsRecords: [
      { type: "CNAME", name: "go", value: "cname.linkpulse.io", status: "configured" },
    ],
    createdAt: "2026-01-20T00:00:00.000Z",
  },
  {
    id: "dom_2",
    workspaceId: "ws_main",
    hostname: "link.acme.dev",
    status: "pending",
    sslStatus: "provisioning",
    isCustom: true,
    isDefault: false,
    dnsRecords: [
      { type: "CNAME", name: "link", value: "cname.linkpulse.io", status: "missing" },
    ],
    createdAt: "2026-08-01T00:00:00.000Z",
  },
];

let notificationsDatabase: NotificationItem[] = [
  {
    id: "notif_1",
    title: "Link Expiration Notice",
    message: "Your link ly.nk/webinar-flash expired yesterday.",
    type: "warning",
    read: false,
    createdAt: "1 hour ago",
  },
  {
    id: "notif_2",
    title: "Traffic Spike Alert",
    message: "ly.nk/pro-40off received over 1,200 clicks in the last hour.",
    type: "success",
    read: false,
    createdAt: "3 hours ago",
  },
  {
    id: "notif_3",
    title: "New Team Member Joined",
    message: "Marcus Vance accepted the invitation to join Acme Production.",
    type: "info",
    read: true,
    createdAt: "1 day ago",
  },
];

export const mockDataStore = {
  getUser: () => initialUser,
  getWorkspaces: () => initialWorkspaces,
  getMembers: (wsId: string) => initialMembers.filter((m) => m.workspaceId === wsId),
  getDomains: (wsId: string) => domainsDatabase.filter((d) => d.workspaceId === wsId),
  getNotifications: () => notificationsDatabase,

  getLinks: (params: LinkFilterParams = {}): PaginatedResponse<Link> => {
    const { page = 1, limit = 10, search = "", status = "all", sortBy = "createdAt", sortOrder = "desc" } = params;

    let filtered = [...linksDatabase].filter((link) => {
      const matchSearch =
        !search ||
        link.title.toLowerCase().includes(search.toLowerCase()) ||
        link.shortCode.toLowerCase().includes(search.toLowerCase()) ||
        link.originalUrl.toLowerCase().includes(search.toLowerCase());

      const matchStatus = status === "all" || !status || link.status === status;
      return matchSearch && matchStatus;
    });

    filtered.sort((a, b) => {
      if (sortBy === "clicks") {
        return sortOrder === "asc" ? a.clicks - b.clicks : b.clicks - a.clicks;
      }
      if (sortBy === "title") {
        return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      }
      return sortOrder === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  },

  getLinkById: (id: string): Link | undefined => {
    return linksDatabase.find((l) => l.id === id);
  },

  getLinkByShortCode: (code: string): Link | undefined => {
    return linksDatabase.find((l) => l.shortCode.toLowerCase() === code.toLowerCase());
  },

  createLink: (dto: CreateLinkDto): Link => {
    const slug = dto.shortCode || Math.random().toString(36).substring(2, 8);
    const domain = dto.domain || "ly.nk";
    const newLink: Link = {
      id: `lnk_${Date.now()}`,
      workspaceId: dto.workspaceId || "ws_main",
      title: dto.title || slug,
      originalUrl: dto.originalUrl,
      shortCode: slug,
      shortUrl: `${domain}/${slug}`,
      domain,
      clicks: 0,
      uniqueVisitors: 0,
      status: dto.status || "active",
      tags: dto.tags || ["General"],
      createdAt: new Date().toISOString(),
      expiresAt: dto.expiresAt,
      password: dto.password,
      utmSource: dto.utmSource,
      utmMedium: dto.utmMedium,
      utmCampaign: dto.utmCampaign,
      qrSettings: dto.qrSettings,
    };
    linksDatabase = [newLink, ...linksDatabase];
    return newLink;
  },

  updateLink: (id: string, updates: UpdateLinkDto): Link | undefined => {
    const index = linksDatabase.findIndex((l) => l.id === id);
    if (index === -1) return undefined;
    linksDatabase[index] = { ...linksDatabase[index], ...updates, updatedAt: new Date().toISOString() };
    return linksDatabase[index];
  },

  deleteLink: (id: string): boolean => {
    const initialLen = linksDatabase.length;
    linksDatabase = linksDatabase.filter((l) => l.id !== id);
    return linksDatabase.length < initialLen;
  },

  bulkDeleteLinks: (ids: string[]): number => {
    const initialLen = linksDatabase.length;
    linksDatabase = linksDatabase.filter((l) => !ids.includes(l.id));
    return initialLen - linksDatabase.length;
  },

  recordClick: (shortCode: string): void => {
    const link = linksDatabase.find((l) => l.shortCode.toLowerCase() === shortCode.toLowerCase());
    if (link) {
      link.clicks += 1;
    }
  },

  getAnalyticsSummary: (): AnalyticsSummary => {
    const totalClicks = linksDatabase.reduce((acc, curr) => acc + curr.clicks, 0);
    const uniqueVisitors = Math.round(totalClicks * 0.72);
    const activeLinksCount = linksDatabase.filter((l) => l.status === "active").length;

    return {
      totalClicks,
      uniqueVisitors,
      averageCtr: 14.2,
      activeLinksCount,
      clickGrowthRate: 24.5,
      topCountry: { country: "United States", flag: "🇺🇸", percentage: 42 },
      topReferrer: { name: "Google Search", percentage: 38 },
    };
  },

  getTimelineData: (): ClickPoint[] => [
    { date: "Aug 01", clicks: 1200, unique: 850 },
    { date: "Aug 02", clicks: 1850, unique: 1300 },
    { date: "Aug 03", clicks: 1600, unique: 1150 },
    { date: "Aug 04", clicks: 2400, unique: 1700 },
    { date: "Aug 05", clicks: 3100, unique: 2200 },
    { date: "Aug 06", clicks: 2800, unique: 1950 },
    { date: "Aug 07", clicks: 3400, unique: 2400 },
    { date: "Aug 08", clicks: 4100, unique: 2900 },
    { date: "Aug 09", clicks: 3800, unique: 2650 },
    { date: "Aug 10", clicks: 4500, unique: 3100 },
    { date: "Aug 11", clicks: 4900, unique: 3400 },
    { date: "Aug 12", clicks: 5600, unique: 3900 },
    { date: "Aug 13", clicks: 5200, unique: 3600 },
    { date: "Aug 14", clicks: 6100, unique: 4250 },
  ],

  getGeoData: (): GeoStat[] => [
    { country: "United States", flag: "🇺🇸", clicks: 62450, percentage: 42 },
    { country: "Germany", flag: "🇩🇪", clicks: 28900, percentage: 19 },
    { country: "United Kingdom", flag: "🇬🇧", clicks: 22400, percentage: 15 },
    { country: "Japan", flag: "🇯🇵", clicks: 14800, percentage: 10 },
    { country: "Canada", flag: "🇨🇦", clicks: 10200, percentage: 7 },
    { country: "France", flag: "🇫🇷", clicks: 7140, percentage: 5 },
  ],

  getDeviceData: (): DeviceStat[] => [
    { name: "Mobile", value: 58, color: "#3b82f6" },
    { name: "Desktop", value: 34, color: "#6366f1" },
    { name: "Tablet", value: 8, color: "#a855f7" },
  ],

  getBrowserData: (): BrowserStat[] => [
    { name: "Google Chrome", percentage: 64 },
    { name: "Apple Safari", percentage: 22 },
    { name: "Mozilla Firefox", percentage: 9 },
    { name: "Microsoft Edge", percentage: 5 },
  ],

  getReferrerData: (): ReferrerStat[] => [
    { name: "Google Search", clicks: 54300, percentage: 38 },
    { name: "Twitter / X", clicks: 35700, percentage: 25 },
    { name: "LinkedIn", clicks: 25700, percentage: 18 },
    { name: "Direct Traffic", clicks: 17100, percentage: 12 },
    { name: "Email Newsletters", clicks: 10090, percentage: 7 },
  ],

  getLiveClicks: (): LiveClick[] => [
    { id: "feed_1", linkId: "lnk_101", shortCode: "summer26", country: "United States", flag: "🇺🇸", browser: "Chrome", os: "macOS", ip: "172.56.xx.xx", time: "Just now" },
    { id: "feed_2", linkId: "lnk_102", shortCode: "docs-q3", country: "Germany", flag: "🇩🇪", browser: "Firefox", os: "Windows", ip: "84.115.xx.xx", time: "12s ago" },
    { id: "feed_3", linkId: "lnk_101", shortCode: "summer26", country: "United Kingdom", flag: "🇬🇧", browser: "Safari", os: "iOS", ip: "92.40.xx.xx", time: "28s ago" },
    { id: "feed_4", linkId: "lnk_103", shortCode: "pro-40off", country: "Japan", flag: "🇯🇵", browser: "Chrome", os: "Android", ip: "133.203.xx.xx", time: "45s ago" },
    { id: "feed_5", linkId: "lnk_106", shortCode: "v2.4", country: "Canada", flag: "🇨🇦", browser: "Edge", os: "Windows", ip: "24.222.xx.xx", time: "1m ago" },
  ],
};
