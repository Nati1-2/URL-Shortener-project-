export const APP_NAME = "LinkPulse";
export const APP_DESCRIPTION = "Shorten links. Track clicks. Grow faster. Enterprise-grade URL shortener & click analytics platform.";
export const DEFAULT_DOMAIN = "ly.nk";

export const DOMAINS = [
  { value: "ly.nk", label: "ly.nk (Default)" },
  { value: "pulse.link", label: "pulse.link (Pro)" },
  { value: "go.brand.io", label: "go.brand.io (Custom)" },
];

export const MOCK_USER = {
  id: "usr_99812",
  name: "Alex Vance",
  email: "alex.vance@acme.inc",
  role: "Pro Account",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  plan: "Pro Plan",
};

export const PRICING_PLANS = [
  {
    id: "free",
    name: "Starter",
    description: "Essential link shortening for individuals & small side projects.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    badge: null,
    highlight: false,
    cta: "Get Started Free",
    features: [
      "Up to 1,000 tracked clicks / mo",
      "50 Active shortened URLs",
      "Basic location & device analytics",
      "Standard QR Code generator",
      "Community support",
    ],
  },
  {
    id: "pro",
    name: "Pro Growth",
    description: "Designed for scaling brands, creators & fast-moving growth teams.",
    monthlyPrice: 19,
    yearlyPrice: 15,
    badge: "MOST POPULAR",
    highlight: true,
    cta: "Start 14-Day Free Trial",
    features: [
      "Up to 100,000 tracked clicks / mo",
      "Unlimited active shortened links",
      "Custom branded domains (e.g. go.brand.com)",
      "Password protection & expiration dates",
      "UTM Builder & redirect rule engine",
      "Custom styled QR codes with logo insert",
      "Granular real-time analytics & export",
      "Priority 24/7 support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Maximum scale, 99.99% uptime SLA, and custom integration pipeline.",
    monthlyPrice: 99,
    yearlyPrice: 79,
    badge: null,
    highlight: false,
    cta: "Contact Enterprise Sales",
    features: [
      "Unlimited clicks & custom link capacity",
      "Multi-user team workspace & SSO (SAML/Okta)",
      "Dedicated IP address & custom domain SSL",
      "Deep REST API access (100,000 req/min)",
      "Audit logs & compliance reporting",
      "Dedicated account manager",
    ],
  },
];

export const FAQS = [
  {
    question: "How does custom branded domain shortening work?",
    answer: "You can easily connect your own custom domain or subdomain (like link.yourcompany.com) by pointing your DNS CNAME record to our edge servers. Your short links will maintain 100% brand recognition and higher click-through rates.",
  },
  {
    question: "Can I change the destination URL after creating a short link?",
    answer: "Yes! All LinkPulse links are dynamic short links. You can edit the destination URL anytime without changing the short link code or invalidating printed QR codes.",
  },
  {
    question: "Are password protection and link expiration included?",
    answer: "Yes, our Pro and Enterprise plans support secret password protection, scheduled expiration dates, and maximum click threshold limits.",
  },
  {
    question: "Is there an API available for programmatic link creation?",
    answer: "Absolutely. We offer a developer-first REST API with full documentation, webhooks, Node.js SDK, and Python SDK for automated URL generation at scale.",
  },
];
