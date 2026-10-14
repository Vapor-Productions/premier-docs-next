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
    <ol className="flow-steps">
      {steps.map((step, index) => (
        <li key={step}>
          <span className="flow-steps__index">{index + 1}</span>
          <span className="flow-steps__text">{step}</span>
        </li>
      ))}
    </ol>
  );
}
