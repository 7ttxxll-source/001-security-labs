const GUARDIAN_INVITE_URL =
  "https://discord.com/oauth2/authorize?client_id=1535228662641725520"

const securityEventData = [
  {
    label: "EVENT",
    value: "CHANNEL DELETE",
    className: "",
  },
  {
    label: "SEVERITY",
    value: "HIGH",
    className: "danger-value",
  },
  {
    label: "ACTOR",
    value: "IDENTIFIED",
    className: "",
  },
  {
    label: "BLACK BOX",
    value: "SECURED",
    className: "safe-value",
  },
  {
    label: "INTEGRITY",
    value: "SHA-256",
    className: "",
  },
  {
    label: "RECOVERY",
    value: "AVAILABLE",
    className: "safe-value",
  },
]

const capabilities = [
  {
    number: "01",
    title: "ROLE SECURITY",
    text:
      "Monitors dangerous role permission changes, attributes the actor and records verified security evidence.",
  },
  {
    number: "02",
    title: "CHANNEL SECURITY",
    text:
      "Detects critical channel activity and preserves structural state for supported recovery operations.",
  },
  {
    number: "03",
    title: "WEBHOOK SECURITY",
    text:
      "Monitors webhook creation, updates and deletion while keeping webhook tokens and URLs out of forensic storage.",
  },
  {
    number: "04",
    title: "BLACK BOX",
    text:
      "Preserves verified forensic snapshots with SHA-256 integrity protection for supported security events.",
  },
  {
    number: "05",
    title: "INCIDENT ENGINE",
    text:
      "Transforms critical security activity into structured incidents designed for investigation and response.",
  },
  {
    number: "06",
    title: "THREAT CORE",
    text:
      "Correlates related incidents so suspicious activity is analyzed as a larger security picture instead of isolated alerts.",
  },
  {
    number: "07",
    title: "RECOVERY",
    text:
      "Determines what can safely be recovered and prepares supported structural restoration workflows.",
  },
  {
    number: "08",
    title: "ZERO SETUP",
    text:
      "Add Guardian to a server and its private control infrastructure is provisioned and maintained automatically.",
  },
  {
    number: "09",
    title: "TRUSTED ACTIONS",
    text:
      "Guardian distinguishes verified internal recovery operations from hostile activity to prevent false incidents.",
  },
]

const responseFlow = [
  {
    number: "01",
    title: "THREAT DETECTED",
    text:
      "Guardian detects critical Discord activity as it happens.",
  },
  {
    number: "02",
    title: "ACTOR IDENTIFIED",
    text:
      "Discord Audit Logs are analyzed to attribute the action to the responsible account.",
  },
  {
    number: "03",
    title: "STATE PRESERVED",
    text:
      "Guardian captures the supported structural state surrounding the security event.",
  },
  {
    number: "04",
    title: "EVIDENCE SECURED",
    text:
      "Forensic evidence is preserved inside the Guardian Black Box with integrity verification.",
  },
  {
    number: "05",
    title: "INCIDENT CREATED",
    text:
      "The security event becomes a structured Guardian incident with a unique forensic record.",
  },
  {
    number: "06",
    title: "THREAT CORRELATED",
    text:
      "Related security activity is connected through Threat Core instead of being treated as isolated alerts.",
  },
  {
    number: "07",
    title: "RECOVERY ANALYZED",
    text:
      "Guardian determines which parts of the affected Discord structure can safely be restored.",
  },
  {
    number: "08",
    title: "CONTROL RESTORED",
    text:
      "Server operators receive the evidence, incident context and supported recovery path needed to respond.",
  },
]

const traditionalSteps = [
  "BAD ACTION",
  "ALERT / PUNISH",
]

const guardianSteps = [
  "BAD ACTION",
  "IDENTIFY ACTOR",
  "PRESERVE STATE",
  "SECURE EVIDENCE",
  "CREATE INCIDENT",
  "CORRELATE THREAT",
  "PREPARE RECOVERY",
]

function FlowSteps({ steps, guardian = false }) {
  return (
    <div className="comparison-flow">
      {steps.map((step, index) => (
        <div key={step}>
          <strong>{step}</strong>

          {index < steps.length - 1 && (
            <i aria-hidden="true">↓</i>
          )}
        </div>
      ))}
    </div>
  )
}

function GuardianShowcase() {
  return (
    <section
      className="guardian-showcase"
      id="guardian"
      aria-labelledby="guardian-title"
    >
      {/* =====================================================
          GUARDIAN INTRO
          ===================================================== */}

      <div className="guardian-heading">
        <div>
          <p className="eyebrow">
            001 PRODUCT / 01
          </p>

          <h2 id="guardian-title">
            001
            <span> GUARDIAN</span>
          </h2>
        </div>

        <div className="guardian-heading-copy">
          <p>
            The Black Box of your Discord server.
          </p>

          <span>
            Advanced Discord security designed to detect critical activity,
            identify the actor, preserve forensic evidence, correlate related
            threats and prepare supported structural recovery.
          </span>
        </div>
      </div>

      {/* =====================================================
          LIVE SECURITY EVENT
          ===================================================== */}

      <div className="guardian-terminal">
        <div className="terminal-topbar">
          <div className="terminal-title">
            <span className="terminal-dot" />

            GUARDIAN LIVE SECURITY EVENT
          </div>

          <span className="terminal-status">
            LIVE
          </span>
        </div>

        <div className="terminal-body">
          <div className="terminal-left">
            <span className="terminal-label">
              SECURITY EVENT
            </span>

            <h3>
              CHANNEL DELETION DETECTED
            </h3>

            <div className="terminal-data">
              {securityEventData.map((item) => (
                <div key={item.label}>
                  <span>
                    {item.label}
                  </span>

                  <strong
                    className={item.className || undefined}
                  >
                    {item.value}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          <div
            className="terminal-visual"
            aria-hidden="true"
          >
            <div className="threat-circle threat-circle-one" />
            <div className="threat-circle threat-circle-two" />
            <div className="threat-circle threat-circle-three" />

            <div className="threat-core">
              <span>
                001
              </span>

              <strong>
                GUARDIAN
              </strong>
            </div>

            <div className="threat-pulse" />
          </div>
        </div>

        <div className="terminal-footer">
          <span>
            INCIDENT ENGINE: ACTIVE
          </span>

          <span>
            THREAT CORE: ARMED
          </span>

          <span>
            BLACK BOX: READY
          </span>

          <span>
            RECOVERY: READY
          </span>
        </div>
      </div>

      {/* =====================================================
          CORE CAPABILITIES
          ===================================================== */}

      <div className="guardian-capabilities">
        {capabilities.map((capability) => (
          <article key={capability.number}>
            <span className="capability-number">
              {capability.number}
            </span>

            <h3>
              {capability.title}
            </h3>

            <p>
              {capability.text}
            </p>
          </article>
        ))}
      </div>

      {/* =====================================================
          RESPONSE FLOW
          ===================================================== */}

      <div className="attack-flow">
        <div className="attack-flow-heading">
          <p className="eyebrow">
            HOW GUARDIAN RESPONDS
          </p>

          <h2>
            An attack becomes
            <span> evidence.</span>
          </h2>
        </div>

        <div className="flow-grid">
          {responseFlow.map((item) => (
            <div
              className="flow-item"
              key={item.number}
            >
              <span>
                {item.number}
              </span>

              <h3>
                {item.title}
              </h3>

              <p>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          GUARDIAN VS TRADITIONAL ANTI-NUKE
          ===================================================== */}

      <div className="guardian-comparison">
        <div className="comparison-heading">
          <p className="eyebrow">
            BEYOND ANTI-NUKE
          </p>

          <h2>
            Detection isn't
            <span> enough.</span>
          </h2>
        </div>

        <div className="comparison-grid">
          <div className="comparison-card traditional">
            <span>
              TRADITIONAL ANTI-NUKE
            </span>

            <FlowSteps
              steps={traditionalSteps}
            />

            <p>
              Traditional protection commonly focuses on detecting the
              action and punishing the account. The forensic story often
              ends there.
            </p>
          </div>

          <div className="comparison-card guardian">
            <span>
              001 GUARDIAN
            </span>

            <FlowSteps
              steps={guardianSteps}
              guardian
            />

            <p>
              Guardian preserves the story of the attack — who acted,
              what changed, what evidence was secured, how events are
              related and what can be recovered.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          FINAL CALL TO ACTION
          ===================================================== */}

      <div className="guardian-cta">
        <div>
          <p className="eyebrow">
            001 GUARDIAN / V1.0.0
          </p>

          <h2>
            Protect what you've
            <span> built.</span>
          </h2>

          <p>
            Add 001 Guardian to your Discord server and activate an advanced
            security layer built around live protection, forensic evidence,
            incident intelligence, threat correlation and recovery.
          </p>
        </div>

        <div className="guardian-cta-actions">
          <a
            href={GUARDIAN_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="primary-button"
            aria-label="Add 001 Guardian to Discord"
          >
            Add to Discord

            <span aria-hidden="true">
              →
            </span>
          </a>

          <a
            href="#contact"
            className="secondary-button"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  )
}

export default GuardianShowcase