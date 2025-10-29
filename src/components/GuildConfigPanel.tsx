import React from "react";

interface GuildConfigProps {
  guildConfig: any;
}

export default function GuildConfigPanel({ guildConfig }: GuildConfigProps) {
  const server = guildConfig.server || {};
  const nitrado = guildConfig.Nitrado || {};

  return (
    <div className="bg-neutral-800 text-white rounded-xl p-6 shadow-md space-y-6">
      <h2 className="text-2xl font-semibold mb-4">
        {server.serverName || "Unnamed Server"} Configuration
      </h2>

      <Section title="General Settings">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Server Name" value={server.serverName} />
          <InputField label="Server ID" value={server.serverID} disabled />
          <SwitchField label="Auto Restart" value={server.autoRestart} />
          <SwitchField
            label="Show Killfeed Coords"
            value={server.showKillfeedCoords}
          />
          <SwitchField
            label="Show Killfeed Weapon"
            value={server.showKillfeedWeapon}
          />
        </div>
      </Section>

      <Section title="Purchasable Features">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SwitchField label="Purchase UAV" value={server.purchaseUAV} />
          <SwitchField label="Purchase EMP" value={server.purchaseEMP} />
          <InputField label="UAV Price" value={server.uavPrice} type="number" />
          <InputField label="EMP Price" value={server.empPrice} type="number" />
        </div>
      </Section>

      <Section title="Channels">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="Killfeed Channel"
            value={server.killfeedChannel}
            options={server.allowedChannels}
          />
          <SelectField
            label="Connection Logs Channel"
            value={server.connectionLogsChannel}
            options={server.allowedChannels}
          />
          <SelectField
            label="Active Players Channel"
            value={server.activePlayersChannel}
            options={server.allowedChannels}
          />
          <SelectField
            label="Welcome Channel"
            value={server.welcomeChannel}
            options={server.allowedChannels}
          />
        </div>
      </Section>

      <Section title="Economy">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Starting Balance"
            value={server.startingBalance}
            type="number"
          />
          <InputField
            label="Income Limiter (Hours)"
            value={server.incomeLimiter}
            type="number"
          />
        </div>
      </Section>

      <Section title="Roles">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Linked Gamertag Role"
            value={server.linkedGamertagRole}
          />
          <InputField label="Member Role" value={server.memberRole} />
          <InputField label="Admin Role" value={server.adminRole} />
        </div>
      </Section>

      <Section title="Combat & Timers">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Combat Log Timer"
            value={server.combatLogTimer}
            type="number"
          />
        </div>
      </Section>

      <Section title="Nitrado Info">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Server ID" value={nitrado.ServerID} disabled />
          <InputField label="User ID" value={nitrado.UserID} disabled />
          <InputField label="Mission" value={nitrado.Mission} />
          <InputField label="Status" value={nitrado.Status} />
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
