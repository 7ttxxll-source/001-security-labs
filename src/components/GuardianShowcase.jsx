function GuardianShowcase() {
  const flow = [
    {
      number: "01",
      title: "THREAT DETECTED",
      text: "Guardian detects critical Discord activity as it happens.",
    },
    {
      number: "02",
      title: "ACTOR IDENTIFIED",
      text: "Discord Audit Logs are analyzed to attribute the action.",
    },
    {
      number: "03",
      title: "EVIDENCE SECURED",
      text: "Guardian preserves verified forensic state inside the Black Box.",
    },
    {
      number: "04",
      title: "INCIDENT CREATED",
      text: "The security event becomes a structured Guardian incident.",
    },
    {
      number: "05",
      title: "THREAT CORRELATED",
      text: "Related activity is connected into a larger security picture.",
    },
    {
      number: "06",
      title: "RECOVERY PREPARED",
      text: "Guardian determines what can safely be restored.",
    },
  ]

  return (
    <section className="guardian-showcase" id="guardian">
      <div className="guardian-heading">
        <div>
          <p className="eyebrow">001 PRODUCT / 01</p>

          <h2>
            001
            <span> GUARDIAN</span>
          </h2>
        </div>

        <div className="guardian-heading-copy">
          <p>
            The Black Box of your Discord server.
          </p>

          <span>
            Protection, forensic evidence, incident intelligence and
            structural recovery inside one security platform.
          </span>
        </div>
      </div>

      <div className="guardian-terminal">
        <div className="terminal-topbar">
          <div className="terminal-title">
            <span className="terminal-dot" />
            GUARDIAN LIVE SECURITY EVENT
          </div>

          <span className="terminal-status">LIVE</span>
        </div>

        <div className="terminal-body">
          <div className="terminal-left">
            <span className="terminal-label">
              SECURITY EVENT
            </span>

            <h3>CHANNEL DELETION DETECTED</h3>

            <div className="terminal-data">
              <div>
                <span>EVENT</span>
                <strong>CHANNEL DELETE</strong>
              </div>

              <div>
                <span>SEVERITY</span>
                <strong className="danger-value">HIGH</strong>
              </div>

              <div>
                <span>ACTOR</span>
                <strong>IDENTIFIED</strong>
              </div>

              <div>
                <span>BLACK BOX</span>
                <strong className="safe-value">SECURED</strong>
              </div>

              <div>
                <span>INTEGRITY</span>
                <strong>SHA-256</strong>
              </div>

              <div>
                <span>RECOVERY</span>
                <strong className="safe-value">AVAILABLE</strong>
              </div>
            </div>
          </div>

          <div className="terminal-visual">
            <div className="threat-circle threat-circle-one" />
            <div className="threat-circle threat-circle-two" />
            <div className="threat-circle threat-circle-three" />

            <div className="threat-core">
              <span>001</span>
              <strong>GUARDIAN</strong>
            </div>

            <div className="threat-pulse" />
          </div>
        </div>

        <div className="terminal-footer">
          <span>INCIDENT ENGINE: ACTIVE</span>
          <span>THREAT CORE: ARMED</span>
          <span>BLACK BOX: READY</span>
        </div>
      </div>

      <div className="guardian-capabilities">
        <article>
          <span className="capability-number">01</span>
          <h3>LIVE PROTECTION</h3>
          <p>
            Continuous monitoring of critical role, channel and webhook
            activity.
          </p>
        </article>

        <article>
          <span className="capability-number">02</span>
          <h3>BLACK BOX</h3>
          <p>
            Verified forensic snapshots with integrity protection for
            supported security events.
          </p>
        </article>

        <article>
          <span className="capability-number">03</span>
          <h3>INCIDENT ENGINE</h3>
          <p>
            Security events become structured incidents built for
            investigation.
          </p>
        </article>

        <article>
          <span className="capability-number">04</span>
          <h3>THREAT CORE</h3>
          <p>
            Related incidents are correlated instead of treated as isolated
            alerts.
          </p>
        </article>

        <article>
          <span className="capability-number">05</span>
          <h3>RECOVERY</h3>
          <p>
            Guardian determines and prepares supported structural recovery
            operations.
          </p>
        </article>

        <article>
          <span className="capability-number">06</span>
          <h3>ZERO SETUP</h3>
          <p>
            Add Guardian to the server and its private control infrastructure
            is provisioned automatically.
          </p>
        </article>
      </div>

      <div className="attack-flow">
        <div className="attack-flow-heading">
          <p className="eyebrow">HOW GUARDIAN RESPONDS</p>

          <h2>
            An attack becomes
            <span> evidence.</span>
          </h2>
        </div>

        <div className="flow-grid">
          {flow.map((item) => (
            <div className="flow-item" key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="guardian-comparison">
        <div className="comparison-heading">
          <p className="eyebrow">BEYOND ANTI-NUKE</p>

          <h2>
            Detection isn't
            <span> enough.</span>
          </h2>
        </div>

        <div className="comparison-grid">
          <div className="comparison-card traditional">
            <span>TRADITIONAL ANTI-NUKE</span>

            <div className="comparison-flow">
              <strong>BAD ACTION</strong>
              <i>↓</i>
              <strong>ALERT / PUNISH</strong>
            </div>

            <p>
              The event is stopped or reported, but the investigation often
              ends there.
            </p>
          </div>

          <div className="comparison-card guardian">
            <span>001 GUARDIAN</span>

            <div className="comparison-flow">
              <strong>BAD ACTION</strong>
              <i>↓</i>
              <strong>IDENTIFY ACTOR</strong>
              <i>↓</i>
              <strong>SECURE EVIDENCE</strong>
              <i>↓</i>
              <strong>CREATE INCIDENT</strong>
              <i>↓</i>
              <strong>CORRELATE THREAT</strong>
              <i>↓</i>
              <strong>PREPARE RECOVERY</strong>
            </div>

            <p>
              Guardian preserves the story of the attack, not just the alert.
            </p>
          </div>
        </div>
      </div>

      <div className="guardian-cta">
        <div>
          <p className="eyebrow">001 GUARDIAN V1.0</p>

          <h2>
            Protect what you've
            <span> built.</span>
          </h2>

          <p>
            Advanced Discord security designed for communities where
            infrastructure, evidence and recovery matter.
          </p>
        </div>

        <div className="guardian-cta-actions">
          <a href="#contact" className="primary-button">
            Add to Discord
            <span>→</span>
          </a>

          <a href="#contact" className="secondary-button">
            Contact Support
          </a>
        </div>
      </div>
    </section>
  )
}

export default GuardianShowcase