export interface ShortLink {
  id: string;
  title: string;
  shortUrl: string;
  shortCode: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
  status: "active" | "expired" | "password_protected";
  domain: string;
  tags: string[];
  password?: string;
  expiresAt?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export const INITIAL_LINKS: ShortLink[] = [
  {
    id: "lnk_101",
    title: "Summer Product Launch Announcement 2026",
    shortUrl: "ly.nk/summer26",
    shortCode: "summer26",
    originalUrl: "https://acme.inc/blog/product-release-summer-2026-announcement-v2?utm_source=twitter&utm_medium=social",
    clicks: 14280,
    createdAt: "2026-08-01T10:15:00Z",
    status: "active",
    domain: "ly.nk",
    tags: ["Product", "Marketing"],
    utmSource: "twitter",
    utmMedium: "social",
    utmCampaign: "summer_launch",
  },
  {
    id: "lnk_102",
    title: "Q3 Developer Documentation Portal",
    shortUrl: "ly.nk/docs-q3",
    shortCode: "docs-q3",
    originalUrl: "https://docs.acme.inc/v3/getting-started/quickstart-guide",
    clicks: 9840,
    createdAt: "2026-08-05T14:30:00Z",
    status: "active",
    domain: "ly.nk",
    tags: ["Docs", "Engineering"],
  },
  {
    id: "lnk_103",
    title: "Exclusive Pro Plan 40% Discount Campaign",
    shortUrl: "pulse.link/pro-40off",
    shortCode: "pro-40off",
    originalUrl: "https://acme.inc/pricing?checkout=true&code=VIP40",
    clicks: 6510,
    createdAt: "2026-08-10T09:00:00Z",
    status: "password_protected",
    domain: "pulse.link",
    tags: ["Sales", "Promo"],
    password: "••••••••",
  },
  {
    id: "lnk_104",
    title: "Y Combinator Demo Day Presentation Deck",
    shortUrl: "ly.nk/yc-deck",
    shortCode: "yc-deck",
    originalUrl: "https://pitch.com/p/yc-summer-2026-acme-deck-v4",
    clicks: 3120,
    createdAt: "2026-07-28T18:45:00Z",
    status: "active",
    domain: "ly.nk",
    tags: ["Investors", "Presentation"],
  },
  {
    id: "lnk_105",
    title: "Limited Flash Sale Webinar Registration",
    shortUrl: "ly.nk/webinar-flash",
    shortCode: "webinar-flash",
    originalUrl: "https://zoom.us/webinar/register/WN_84920492019",
    clicks: 890,
    createdAt: "2026-07-15T11:00:00Z",
    status: "expired",
    domain: "ly.nk",
    tags: ["Webinar"],
    expiresAt: "2026-08-01T23:59:59Z",
  },
  {
    id: "lnk_106",
    title: "GitHub Repository Latest v2.4 Tag",
    shortUrl: "go.brand.io/v2.4",
    shortCode: "v2.4",
    originalUrl: "https://github.com/acme/core-engine/releases/tag/v2.4.0",
    clicks: 4320,
    createdAt: "2026-08-12T16:20:00Z",
    status: "active",
    domain: "go.brand.io",
    tags: ["GitHub", "Releases"],
  },
];

export const CLICK_TIMELINE_DATA = [
  { date: "Aug 01", clicks: 1240, unique: 980 },
  { date: "Aug 02", clicks: 1890, unique: 1450 },
  { date: "Aug 03", clicks: 2450, unique: 1910 },
  { date: "Aug 04", clicks: 2100, unique: 1680 },
  { date: "Aug 05", clicks: 3120, unique: 2400 },
  { date: "Aug 06", clicks: 2980, unique: 2250 },
  { date: "Aug 07", clicks: 3650, unique: 2890 },
  { date: "Aug 08", clicks: 4200, unique: 3410 },
  { date: "Aug 09", clicks: 3890, unique: 3050 },
  { date: "Aug 10", clicks: 4900, unique: 3950 },
  { date: "Aug 11", clicks: 5410, unique: 4300 },
  { date: "Aug 12", clicks: 6120, unique: 4980 },
  { date: "Aug 13", clicks: 5800, unique: 4620 },
  { date: "Aug 14", clicks: 6740, unique: 5310 },
];

export const GEO_LOCATION_DATA = [
  { country: "United States", code: "US", clicks: 18450, flag: "🇺🇸", percentage: 42 },
  { country: "United Kingdom", code: "GB", clicks: 7210, flag: "🇬🇧", percentage: 16 },
  { country: "Germany", code: "DE", clicks: 5120, flag: "🇩🇪", percentage: 12 },
  { country: "Japan", code: "JP", clicks: 3940, flag: "🇯🇵", percentage: 9 },
  { country: "Canada", code: "CA", clicks: 2890, flag: "🇨🇦", percentage: 6 },
  { country: "Brazil", code: "BR", clicks: 2150, flag: "🇧🇷", percentage: 5 },
  { country: "Others", code: "WW", clicks: 4320, flag: "🌐", percentage: 10 },
];

export const DEVICE_DATA = [
  { name: "Mobile", value: 58, color: "#3b82f6" },
  { name: "Desktop", value: 36, color: "#6366f1" },
  { name: "Tablet", value: 6, color: "#a855f7" },
];

export const BROWSER_DATA = [
  { name: "Chrome", percentage: 54 },
  { name: "Safari", percentage: 28 },
  { name: "Firefox", percentage: 10 },
  { name: "Edge", percentage: 8 },
];

export const TRAFFIC_SOURCES_DATA = [
  { source: "Google / Search", clicks: 14890, percentage: 38, icon: "Search" },
  { source: "Twitter / X", clicks: 11200, percentage: 29, icon: "Twitter" },
  { source: "Direct / Email", clicks: 7450, percentage: 19, icon: "Mail" },
  { source: "LinkedIn", clicks: 3890, percentage: 10, icon: "Linkedin" },
  { source: "Other Referrers", clicks: 1630, percentage: 4, icon: "Globe" },
];

export const RECENT_LIVE_FEED = [
  { id: "feed_1", linkId: "lnk_101", shortCode: "summer26", country: "United States", flag: "🇺🇸", browser: "Chrome", os: "macOS", ip: "172.56.xx.xx", time: "Just now" },
  { id: "feed_2", linkId: "lnk_102", shortCode: "docs-q3", country: "Germany", flag: "🇩🇪", browser: "Firefox", os: "Windows", ip: "84.115.xx.xx", time: "12s ago" },
  { id: "feed_3", linkId: "lnk_101", shortCode: "summer26", country: "United Kingdom", flag: "🇬🇧", browser: "Safari", os: "iOS", ip: "92.40.xx.xx", time: "28s ago" },
  { id: "feed_4", linkId: "lnk_103", shortCode: "pro-40off", country: "Japan", flag: "🇯🇵", browser: "Chrome", os: "Android", ip: "133.203.xx.xx", time: "45s ago" },
  { id: "feed_5", linkId: "lnk_106", shortCode: "v2.4", country: "Canada", flag: "🇨🇦", browser: "Edge", os: "Windows", ip: "24.222.xx.xx", time: "1m ago" },
];
