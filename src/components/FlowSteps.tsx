const steps = [
  "Player runs /riot link in Discord",
  "Ephemeral disclaimer + Sign in with Riot",
  "Riot Sign-On login page",
  "Redirect to Premier Planner callback",
  "Bot stores puuid + Riot ID",
  "Player returns to Discord",
  "Team view can show roster status",
];

export function FlowSteps() {
  return (
    <ol className="my-4 list-decimal space-y-2 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-6 py-4 text-[var(--fg-secondary)]">
      {steps.map((step) => (
        <li key={step}>
          <span className="text-[var(--fg)]">{step}</span>
        </li>
      ))}
    </ol>
  );
}
