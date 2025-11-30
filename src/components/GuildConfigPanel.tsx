import React from "react";

interface GuildConfigProps {
  guildConfig: any;
}

export default function GuildConfigPanel({ guildConfig }: GuildConfigProps) {
  const server = guildConfig.server || {};
  const nitrado = guildConfig.nitrado || {};

  return (
    <div className="bg-neutral-800 text-white rounded-xl p-6 shadow-md space-y-6">
      <h2 className="text-2xl font-semibold mb-4">
        {server.serverName || "Unnamed Server"} Configuration
      </h2>

      <Section title="General Settings">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Server Name" value={server.server_name} />
          <InputField label="Guild ID" value={guildConfig.server_id} disabled />
          <SwitchField label="Auto Restart" value={server.auto_restart} />
          <SwitchField
            label="Show Killfeed Coords"
            value={server.show_killfeed_coords}
          />
          <SwitchField
            label="Show Killfeed Weapon"
            value={server.show_killfeed_weapons}
          />
        </div>
      </Section>

      <Section title="Purchasable Features">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SwitchField
            label="Purchase UAV"
            value={server.enable_purchase_uav}
          />
          <SwitchField
            label="Purchase EMP"
            value={server.enable_purchase_emp}
          />
          <InputField
            label="UAV Price"
            value={server.uav_price}
            type="number"
          />
          <InputField
            label="EMP Price"
            value={server.emp_price}
            type="number"
          />
        </div>
      </Section>

      <Section title="Channels">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="Killfeed Channel"
            value={server.killfeed_channel}
            options={server.allowed_command_channels}
          />
          <SelectField
            label="Connection Logs Channel"
            value={server.connection_logs_channel}
            options={server.allowed_command_channels}
          />
          <SelectField
            label="Active Players Channel"
            value={server.active_players_channels}
            options={server.allowed_command_channels}
          />
          <SelectField
            label="Welcome Channel"
            value={server.welcome_channel}
            options={server.allowed_command_channels}
          />
        </div>
      </Section>

      <Section title="Economy">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Starting Balance"
            value={server.starting_balance}
            type="number"
          />
          <InputField
            label="Income Limiter (Hours)"
            value={server.income_limiter_hours}
            type="number"
          />
        </div>
      </Section>

      <Section title="Roles">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Linked Gamertag Role"
            value={server.linked_gamertag_role}
          />
          <InputField label="Member Role" value={server.member_role} />
          <InputField label="Admin Roles" value={server.bot_admin_roles} />
        </div>
      </Section>

      <Section title="Combat & Timers">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Combat Log Timer"
            value={server.combat_log_timer_minutes}
            type="number"
          />
        </div>
      </Section>

      <Section title="Nitrado Info">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Server ID" value={nitrado.server_id} disabled />
          <InputField label="User ID" value={nitrado.user_id} disabled />
          <InputField label="Mission" value={nitrado.mission} />
          <InputField label="Status" value={nitrado.status} />
        </div>
      </Section>
    </div>
  );
}

const Section = ({ title, children }: any) => (
  <section>
    <h3 className="text-lg font-semibold mb-2 border-b border-neutral-600 pb-1">
      {title}
    </h3>
    {children}
  </section>
);

const InputField = ({ label, value, type = "text", disabled = false }: any) => (
  <div className="flex flex-col">
    <label className="text-sm text-gray-300 mb-1">{label}</label>
    <input
      type={type}
      defaultValue={value ?? ""}
      disabled={disabled}
      className={`px-3 py-2 rounded bg-neutral-700 border border-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    />
  </div>
);

const SwitchField = ({ label, value }: any) => (
  <div className="flex items-center justify-between bg-neutral-700 px-4 py-3 rounded-lg shadow-sm">
    <span className="text-sm">{label}</span>
    <label className="relative inline-flex items-center cursor-pointer select-none">
      <input type="checkbox" defaultChecked={value} className="sr-only peer" />
      <div className="w-12 h-6 bg-neutral-500 rounded-full peer peer-checked:bg-green-500 transition-all duration-300"></div>
      <div className="absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-6"></div>
      <span className="absolute text-xs right-1.5 text-white peer-checked:opacity-0 transition-opacity">
        OFF
      </span>
      <span className="absolute text-xs left-1.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity">
        ON
      </span>
    </label>
  </div>
);

const SelectField = ({ label, value, options }: any) => (
  <div className="flex flex-col">
    <label className="text-sm text-gray-300 mb-1">{label}</label>
    <select
      defaultValue={value}
      className="px-3 py-2 rounded bg-neutral-700 border border-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select Channel</option>
      {options?.map((opt: string) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
