"use client";

import React, { useState } from "react";
import {
  User,
  Lock,
  Key,
  Bell,
  CreditCard,
  AlertTriangle,
  Copy,
  Check,
  Plus,
  Trash2,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  Sparkles,
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
import { useToastStore } from "@/store/useToastStore";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState("profile");

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
    { id: "key_1", name: "Production Node.js Backend", token: "sk_live_998249a029310bc94", created: "2026-08-01" },
    { id: "key_2", name: "Staging Testing Environment", token: "sk_test_8492049a029310bc0", created: "2026-08-05" },
  ]);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

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
    const newToken = `sk_live_${Math.random().toString(36).substring(2, 18)}`;
    setApiKeys([...apiKeys, { id: `key_${Date.now()}`, name: newKeyName, token: newToken, created: new Date().toISOString().split("T")[0] }]);
    addToast({ type: "success", title: "API Key Created!", message: newToken });
    setNewKeyName("");
    setShowNewKeyModal(false);
  };

  const handleRevokeApiKey = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id));
    addToast({ type: "success", title: "API Key Revoked" });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#090d16]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />

        <main className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto w-full">
          {/* Header Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Account & Workspace Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage personal profile, API tokens, security, notifications, and subscription billing.
            </p>
          </div>

          {/* Settings Tabs */}
          <Tabs
            tabs={[
              { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
              { id: "security", label: "Security & 2FA", icon: <Lock className="w-4 h-4" /> },
              { id: "apikeys", label: "API Keys", icon: <Key className="w-4 h-4" /> },
              { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
              { id: "billing", label: "Billing & Plans", icon: <CreditCard className="w-4 h-4" /> },
              { id: "danger", label: "Danger Zone", icon: <AlertTriangle className="w-4 h-4" /> },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {/* Tab 1: Profile Settings */}
          {activeTab === "profile" && (
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
                      Upload New Avatar
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Short Bio
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
                <Button type="submit" variant="gradient" size="md">
                  Save Changes
                </Button>
              </form>
            </Card>
          )}

          {/* Tab 2: Security & 2FA */}
          {activeTab === "security" && (
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
                  <Button type="submit" variant="gradient" size="md">
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
          )}

          {/* Tab 3: API Keys */}
          {activeTab === "apikeys" && (
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
                  variant="gradient"
                  size="sm"
                  onClick={() => setShowNewKeyModal(true)}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Generate New Secret Token
                </Button>
              </div>

              <div className="space-y-3 text-xs">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-200/50 dark:border-slate-800/50"
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
          )}

          {/* Tab 4: Notifications */}
          {activeTab === "notifications" && (
            <Card className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Notification Preferences
              </h3>
              <div className="space-y-6 max-w-xl">
                <Switch
                  checked={emailDigest}
                  onChange={setEmailDigest}
                  label="Weekly Click Analytics Email Digest"
                  description="Receive a summary of click performance every Monday."
                />
                <Switch
                  checked={expiryAlerts}
                  onChange={setExpiryAlerts}
                  label="Link Expiration Warning Alerts"
                  description="Get notified when a link is about to expire."
                />
                <Switch
                  checked={trafficSurgeAlerts}
                  onChange={setTrafficSurgeAlerts}
                  label="Sudden Traffic Surge Notifications"
                  description="Alert me when a short link receives >1,000 clicks/hour."
                />
              </div>
            </Card>
          )}

          {/* Tab 5: Billing & Subscription */}
          {activeTab === "billing" && (
            <div className="space-y-6">
              <Card className="space-y-4 border-2 border-blue-500/30 bg-blue-500/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Badge variant="purple">Pro Plan Active</Badge>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">$19 / Month</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Your subscription renews automatically on Sept 14, 2026.
                    </p>
                  </div>
                  <Button variant="gradient" size="md">
                    Upgrade to Enterprise
                  </Button>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span>Monthly Click Limit Usage</span>
                    <span className="text-blue-500">14,230 / 50,000 Clicks (28%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-gradient rounded-full w-[28%]" />
                  </div>
                </div>
              </Card>

              {/* Past Invoices */}
              <Card className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Payment History & Invoices
                </h3>
                <div className="space-y-2 text-xs">
                  {[
                    { id: "inv_101", date: "Aug 01, 2026", amount: "$19.00", status: "Paid" },
                    { id: "inv_100", date: "Jul 01, 2026", amount: "$19.00", status: "Paid" },
                  ].map((inv) => (
                    <div
                      key={inv.id}
                      className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-between"
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
          )}

          {/* Tab 6: Danger Zone */}
          {activeTab === "danger" && (
            <Card className="space-y-4 border-2 border-red-500/30 bg-red-500/5">
              <h3 className="text-lg font-bold text-red-600 dark:text-red-400">
                Danger Zone
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                Permanently delete your account, wipe all shortened link routing rules, and destroy analytics history.
              </p>
              <Button
                variant="danger"
                size="md"
                onClick={() => setShowDeleteAccountModal(true)}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Delete LinkPulse Account
              </Button>
            </Card>
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
            <Button variant="gradient" size="sm" onClick={handleCreateApiKey}>
              Generate Key
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        title="Confirm Account Deletion"
        description="This action will permanently delete all your short URLs and analytics data."
      >
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={() => setShowDeleteAccountModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              addToast({ type: "error", title: "Account deletion requested" });
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
