"use client";

import { useState } from "react";
import { Bell, Palette, ShieldCheck, Database, Save } from "lucide-react";
import Topbar from "@/components/admin/layout/Topbar";
import GlassCard from "@/components/admin/ui/GlassCard";
import Button from "@/components/admin/ui/Button";
import { Field, Input, Select } from "@/components/admin/ui/Field";
import { useToast } from "@/context/admin/ToastContext";
import { classNames } from "@/lib/admin/utils";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={classNames("w-10 h-5.5 rounded-full transition-colors relative shrink-0", checked ? "bg-ember-500" : "bg-white/10")}
      style={{ height: 22, width: 40 }}
    >
      <span
        className={classNames("absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform", checked ? "translate-x-[19px]" : "translate-x-0.5")}
        style={{ width: 18, height: 18 }}
      />
    </button>
  );
}

export default function SettingsPage() {
  const toast = useToast();

  const [orgName, setOrgName] = useState("Mentora");
  const [supportEmail, setSupportEmail] = useState("support@mentora.io");
  const [timezone, setTimezone] = useState("UTC");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);

  function handleSave() {
    toast.success("Settings saved locally");
  }

  return (
    <div>
      <Topbar
        title="Settings"
        subtitle="Admin panel preferences (stored locally for now)"
        actions={<Button icon={Save} onClick={handleSave}>Save changes</Button>}
      />

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-ember-500/10 border border-ember-500/25 flex items-center justify-center text-ember-500">
              <Palette size={15} />
            </div>
            <h3 className="text-sm font-semibold text-ink-100">Organization</h3>
          </div>
          <div className="space-y-4">
            <Field label="Organization name">
              <Input value={orgName} onChange={(e: any) => setOrgName(e.target.value)} />
            </Field>
            <Field label="Support email">
              <Input type="email" value={supportEmail} onChange={(e: any) => setSupportEmail(e.target.value)} />
            </Field>
            <Field label="Timezone">
              <Select value={timezone} onChange={(e: any) => setTimezone(e.target.value)}>
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Asia/Kolkata">India Standard Time</option>
              </Select>
            </Field>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-ember-500/10 border border-ember-500/25 flex items-center justify-center text-ember-500">
              <Bell size={15} />
            </div>
            <h3 className="text-sm font-semibold text-ink-100">Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-100">Email notifications</p>
                <p className="text-xs text-ink-500">Get notified about important admin events</p>
              </div>
              <Toggle checked={emailNotifs} onChange={setEmailNotifs} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-100">Push notifications</p>
                <p className="text-xs text-ink-500">Browser push alerts for urgent items</p>
              </div>
              <Toggle checked={pushNotifs} onChange={setPushNotifs} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-100">Weekly digest</p>
                <p className="text-xs text-ink-500">Summary of platform activity every Monday</p>
              </div>
              <Toggle checked={weeklyDigest} onChange={setWeeklyDigest} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-ember-500/10 border border-ember-500/25 flex items-center justify-center text-ember-500">
              <ShieldCheck size={15} />
            </div>
            <h3 className="text-sm font-semibold text-ink-100">Security</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-100">Two-factor authentication</p>
              <p className="text-xs text-ink-500">Require a code at admin sign-in</p>
            </div>
            <Toggle checked={twoFactor} onChange={setTwoFactor} />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-ember-500/10 border border-ember-500/25 flex items-center justify-center text-ember-500">
              <Database size={15} />
            </div>
            <h3 className="text-sm font-semibold text-ink-100">Data source</h3>
          </div>
          <p className="text-sm text-ink-300 leading-relaxed mb-3">
            This admin panel currently runs on local mock data defined in <code className="text-ember-400 bg-white/5 px-1.5 py-0.5 rounded">src/lib/admin/services/*</code>.
            Nothing here touches a real database yet.
          </p>
          <p className="text-xs text-ink-500">
            When ready, replace each function body in the service layer with the equivalent Supabase call — the UI won&apos;t need to change.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
