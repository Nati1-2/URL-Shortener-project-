"use client";

import React, { useState } from "react";
import {
  User,
  Lock,
  Key,
  Bell,
  CreditCard,
  AlertTriangle,
  Plus,
  Trash2,
  Globe,
  Users,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { useToastStore } from "@/store/useToastStore";
import { useWorkspaceMembers, useInviteMember } from "@/hooks/useWorkspaces";
import { useDomains, useAddDomain, useVerifyDomain } from "@/hooks/useDomains";
import { useSubscription, useCheckout, useBillingPortal } from "@/hooks/useBilling";
import { Role } from "@/types";
import { RevealOnScroll } from "@/components/animation/ScrollReveal";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { activeWorkspaceId } = useUIStore();
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState("profile");

  // Multi-tenant Hooks
  const { data: members } = useWorkspaceMembers(activeWorkspaceId);
  const inviteMemberMutation = useInviteMember(activeWorkspaceId);
  const { data: domains } = useDomains(activeWorkspaceId);
  const addDomainMutation = useAddDomain();
  const verifyDomainMutation = useVerifyDomain();
  const { data: subscription } = useSubscription(activeWorkspaceId);
  const checkoutMutation = useCheckout();
  const billingPortalMutation = useBillingPortal();

  // Profile Form State
  const [name, setName] = useState(user?.name || "Alex Vance");
  const [email, setEmail] = useState(user?.email || "alex.vance@acme.inc");
  const [bio, setBio] = useState("Growth Lead & Marketing Engineer at Acme Inc.");

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // API Keys State
  const [apiKeys, setApiKeys] = useState([
    { id: "key_1", name: "Production Node.js Microservices", token: "sk_live_••••••••••••••••", created: "2026-08-01" },
    { id: "key_2", name: "Staging Testing Environment", token: "sk_test_••••••••••••••••", created: "2026-08-05" },
  ]);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

  // Domain Modal
  const [showNewDomainModal, setShowNewDomainModal] = useState(false);
  const [newHostname, setNewHostname] = useState("");

  // Invite Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("MEMBER");

  // Notifications State
  const [emailDigest, setEmailDigest] = useState(true);
  const [expiryAlerts, setExpiryAlerts] = useState(true);
  const [trafficSurgeAlerts, setTrafficSurgeAlerts] = useState(false);

  // Danger Zone Modal
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({ type: "success", title: "Profile updated successfully" });
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({ type: "success", title: "Security settings updated" });
  };

  const handleCreateApiKey = () => {
    if (!newKeyName) return;
    const randomBytes = new Uint8Array(12);
    crypto.getRandomValues(randomBytes);
    const newToken = `sk_live_${Array.from(randomBytes).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 18)}`;
    const maskedToken = `sk_live_••••••••••••••••`;
    setApiKeys([
      ...apiKeys,
      { id: `key_${Date.now()}`, name: newKeyName, token: maskedToken, created: new Date().toISOString().split("T")[0] },
    ]);
    addToast({ type: "success", title: "API Key Created!", message: "Your new key has been generated. Copy it now — it won't be shown again." });
    setNewKeyName("");
    setShowNewKeyModal(false);
  };

  const handleRevokeApiKey = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id));
    addToast({ type: "success", title: "API Key Revoked" });
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHostname) return;
    addDomainMutation.mutate({ hostname: newHostname, workspaceId: activeWorkspaceId });
    setNewHostname("");
    setShowNewDomainModal(false);
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    inviteMemberMutation.mutate({ email: inviteEmail, role: inviteRole });
    setInviteEmail("");
    setShowInviteModal(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#080c14]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />

        <main className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto w-full">
          {/* Header Title */}
          <RevealOnScroll direction="up" delay={0.02}>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Workspace & Account Settings
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Manage personal profile, API tokens, workspace members, custom domains, and subscription billing.
              </p>
            </div>
          </RevealOnScroll>

          {/* Settings Tabs */}
          <RevealOnScroll direction="up" delay={0.06}>
            <Tabs
              tabs={[
                { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
                { id: "team", label: "Team & Members", icon: <Users className="w-4 h-4" /> },
                { id: "domains", label: "Custom Domains", icon: <Globe className="w-4 h-4" /> },
                { id: "security", label: "Security & 2FA", icon: <Lock className="w-4 h-4" /> },
                { id: "apikeys", label: "API Keys", icon: <Key className="w-4 h-4" /> },
                { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
                { id: "billing", label: "Billing & Plans", icon: <CreditCard className="w-4 h-4" /> },
                { id: "danger", label: "Danger Zone", icon: <AlertTriangle className="w-4 h-4" /> },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </RevealOnScroll>

          {/* Tab 1: Profile Settings */}
          {activeTab === "profile" && (
            <RevealOnScroll direction="up" delay={0.08}>
              <Card className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  Personal Profile Details
                </h3>
                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                  <div className="flex items-center gap-4">
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/30"
                    />
                    <div className="space-y-1">
                      <Button variant="outline" size="sm">
                        Upload Avatar
                      </Button>
                      <p className="text-[11px] text-slate-400">JPG, PNG or GIF up to 5MB.</p>
                    </div>
                  </div>

                  <Input
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="Work Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Short Bio
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full p-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                  <Button type="submit" variant="glow" size="md">
                    Save Changes
                  </Button>
                </form>
              </Card>
            </RevealOnScroll>
          )}

          {/* Tab 2: Team & Workspace Members */}
          {activeTab === "team" && (
            <RevealOnScroll direction="up" delay={0.08}>
              <Card className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Workspace Members & Roles
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Invite collaborators and control access permissions.
                    </p>
                  </div>
                  <Button
                    variant="glow"
                    size="sm"
                    onClick={() => setShowInviteModal(true)}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Invite Member
                  </Button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {members?.map((mem) => (
                    <div key={mem.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={mem.user.avatar}
                          alt={mem.user.name}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-blue-500/20"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{mem.user.name}</p>
                          <p className="text-[11px] text-slate-400">{mem.user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          {mem.role}
                        </span>
                        <span className="text-[11px] text-slate-400 hidden sm:inline">
                          Joined {new Date(mem.joinedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </RevealOnScroll>
          )}

          {/* Tab 3: Custom Domains */}
          {activeTab === "domains" && (
            <RevealOnScroll direction="up" delay={0.08}>
              <Card className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Branded Custom Domains
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Connect your own domain with automatic SSL edge provisioning.
                    </p>
                  </div>
                  <Button
                    variant="glow"
                    size="sm"
                    onClick={() => setShowNewDomainModal(true)}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add Custom Domain
                  </Button>
                </div>

                <div className="space-y-3 text-xs">
                  {domains?.map((dom) => (
                    <div
                      key={dom.id}
                      className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-200/50 dark:border-slate-800/50"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 dark:text-white font-mono text-sm">{dom.hostname}</p>
                          {dom.isDefault && <Badge variant="info">Default</Badge>}
                        </div>
                        <p className="text-[11px] text-slate-400">CNAME target: cname.linkpulse.io</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant={dom.status === "verified" ? "success" : "warning"}>
                          {dom.status === "verified" ? "SSL Active" : "DNS Pending"}
                        </Badge>
                        {dom.status !== "verified" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => verifyDomainMutation.mutate(dom.id)}
                          >
                            Verify DNS
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </RevealOnScroll>
          )}

          {/* Tab 4: Security & 2FA */}
          {activeTab === "security" && (
            <RevealOnScroll direction="up" delay={0.08}>
              <div className="space-y-6">
                <Card className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                    Change Password
                  </h3>
                  <form onSubmit={handleSaveSecurity} className="space-y-4 max-w-xl">
                    <Input
                      label="Current Password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <Input
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Button type="submit" variant="glow" size="md">
                      Update Password
                    </Button>
                  </form>
                </Card>

                <Card className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                    Two-Factor Authentication (2FA)
                  </h3>
                  <Switch
                    checked={twoFactorEnabled}
                    onChange={setTwoFactorEnabled}
                    label="Enable Authenticator App 2FA"
                    description="Use Google Authenticator or 1Password for login verification."
                  />
                </Card>
              </div>
            </RevealOnScroll>
          )}

          {/* Tab 5: API Keys */}
          {activeTab === "apikeys" && (
            <RevealOnScroll direction="up" delay={0.08}>
              <Card className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      REST API Tokens
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Secret API keys to programmatically shorten links via Node.js or Python SDK.
                    </p>
                  </div>
                  <Button
                    variant="glow"
                    size="sm"
                    onClick={() => setShowNewKeyModal(true)}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Generate Secret Token
                  </Button>
                </div>

                <div className="space-y-3 text-xs">
                  {apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-200/50 dark:border-slate-800/50"
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900 dark:text-white">{key.name}</p>
                        <p className="font-mono text-blue-500">{key.token}</p>
                        <span className="text-[10px] text-slate-400">Created {key.created}</span>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRevokeApiKey(key.id)}
                        leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                      >
                        Revoke Key
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </RevealOnScroll>
          )}

          {/* Tab 6: Notifications */}
          {activeTab === "notifications" && (
            <RevealOnScroll direction="up" delay={0.08}>
              <Card className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  Notification Preferences
                </h3>
                <div className="space-y-6 max-w-xl">
                  <Switch
                    checked={emailDigest}
                    onChange={setEmailDigest}
                    label="Weekly Click Telemetry Digest"
                    description="Receive a summary of click performance every Monday."
                  />
                  <Switch
                    checked={expiryAlerts}
                    onChange={setExpiryAlerts}
                    label="Link Expiration Warning Alerts"
                    description="Get notified when a link is approaching its expiration date."
                  />
                  <Switch
                    checked={trafficSurgeAlerts}
                    onChange={setTrafficSurgeAlerts}
                    label="Sudden Traffic Surge Notifications"
                    description="Alert me when a short link receives >1,000 clicks/hour."
                  />
                </div>
              </Card>
            </RevealOnScroll>
          )}

          {/* Tab 7: Billing & Subscription */}
          {activeTab === "billing" && (
            <RevealOnScroll direction="up" delay={0.08}>
              <div className="space-y-6">
                <Card className="space-y-4 border-2 border-blue-500/30 bg-blue-500/5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="purple">{subscription?.planName || "Pro Growth Plan Active"}</Badge>
                        <Badge variant={subscription?.status === "active" ? "success" : "warning"}>
                          {subscription?.status?.toUpperCase() || "ACTIVE"}
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        {subscription?.planId === "enterprise" ? "$79 / Month" : subscription?.planId === "free" ? "$0 / Month" : "$19 / Month"}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {subscription?.currentPeriodEnd
                          ? `Your subscription renews on ${new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}.`
                          : "Manage payment methods and billing intervals via Stripe."}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => billingPortalMutation.mutate()}
                        isLoading={billingPortalMutation.isPending}
                        leftIcon={<CreditCard className="w-4 h-4" />}
                      >
                        Stripe Customer Portal
                      </Button>
                      <Button
                        variant="glow"
                        size="md"
                        onClick={() => {
                          if (subscription?.planId === "enterprise") {
                            billingPortalMutation.mutate();
                          } else {
                            checkoutMutation.mutate({ planId: "enterprise", isYearly: true });
                          }
                        }}
                        isLoading={checkoutMutation.isPending}
                      >
                        {subscription?.planId === "enterprise" ? "Manage Plan" : "Upgrade to Enterprise"}
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span>Monthly Click Limit Usage</span>
                      <span className="text-blue-500">
                        {(subscription?.usedClicksCurrentPeriod ?? 14230).toLocaleString()} / {(subscription?.monthlyClicksLimit ?? 50000).toLocaleString()} Clicks ({Math.round(((subscription?.usedClicksCurrentPeriod ?? 14230) / (subscription?.monthlyClicksLimit ?? 50000)) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-gradient rounded-full"
                        style={{
                          width: `${Math.min(100, Math.round(((subscription?.usedClicksCurrentPeriod ?? 14230) / (subscription?.monthlyClicksLimit ?? 50000)) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Payment Invoices & Receipts
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => billingPortalMutation.mutate()}
                      className="text-xs text-blue-500 hover:text-blue-600"
                    >
                      View all in Stripe →
                    </Button>
                  </div>
                  <div className="space-y-2 text-xs">
                    {[
                      { id: "inv_101", date: "Aug 01, 2026", amount: "$19.00", status: "Paid" },
                      { id: "inv_100", date: "Jul 01, 2026", amount: "$19.00", status: "Paid" },
                    ].map((inv) => (
                      <div
                        key={inv.id}
                        className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 dark:text-white">Pro Plan Subscription</p>
                          <p className="text-[10px] text-slate-400">{inv.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-900 dark:text-white">{inv.amount}</span>
                          <Badge variant="success">{inv.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </RevealOnScroll>
          )}

          {/* Tab 8: Danger Zone */}
          {activeTab === "danger" && (
            <RevealOnScroll direction="up" delay={0.08}>
              <Card className="space-y-4 border-2 border-red-500/30 bg-red-500/5">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400">
                  Danger Zone
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                  Permanently delete this workspace, wipe all shortened link routing rules, and destroy click analytics telemetry.
                </p>
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => setShowDeleteAccountModal(true)}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                >
                  Delete Workspace
                </Button>
              </Card>
            </RevealOnScroll>
          )}
        </main>
      </div>

      {/* New API Key Modal */}
      <Modal
        isOpen={showNewKeyModal}
        onClose={() => setShowNewKeyModal(false)}
        title="Generate Secret API Token"
      >
        <div className="space-y-4 py-2">
          <Input
            label="Token Identifier Name"
            placeholder="e.g. Production Webhook Server"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowNewKeyModal(false)}>
              Cancel
            </Button>
            <Button variant="glow" size="sm" onClick={handleCreateApiKey}>
              Generate Key
            </Button>
          </div>
        </div>
      </Modal>

      {/* New Domain Modal */}
      <Modal
        isOpen={showNewDomainModal}
        onClose={() => setShowNewDomainModal(false)}
        title="Add Branded Custom Domain"
        description="Enter your custom root or subdomain (e.g. go.yourbrand.com)."
      >
        <form onSubmit={handleAddDomain} className="space-y-4 py-2">
          <Input
            label="Domain Hostname"
            placeholder="e.g. go.brand.com"
            value={newHostname}
            onChange={(e) => setNewHostname(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowNewDomainModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="glow" size="sm">
              Add Domain
            </Button>
          </div>
        </form>
      </Modal>

      {/* Invite Member Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Team Member"
      >
        <form onSubmit={handleInviteMember} className="space-y-4 py-2">
          <Input
            label="Collaborator Email Address"
            type="email"
            placeholder="colleague@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Role Permission
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as Role)}
              className="w-full h-10 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
            >
              <option value="ADMIN">ADMIN (Full management)</option>
              <option value="MEMBER">MEMBER (Create & edit links)</option>
              <option value="VIEWER">VIEWER (View-only analytics)</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="glow" size="sm">
              Send Invite
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        title="Confirm Workspace Deletion"
        description="This action will permanently delete all links and analytics."
      >
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={() => setShowDeleteAccountModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              addToast({ type: "error", title: "Workspace deletion requested" });
              setShowDeleteAccountModal(false);
            }}
          >
            Permanently Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
