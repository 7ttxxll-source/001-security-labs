const faqItems = [
  {
    question: "What is 001 Guardian?",
    answer:
      "001 Guardian is an advanced Discord security, incident response, forensic evidence and structural recovery system.",
  },
  {
    question: "Does Guardian automatically configure itself?",
    answer:
      "Yes. When Guardian joins a server with Auto Setup enabled, it provisions its private control infrastructure and maintains it across restarts.",
  },
  {
    question: "What does Guardian monitor?",
    answer:
      "Guardian currently monitors critical role permission changes, channel activity and webhook create, update and delete activity.",
  },
  {
    question: "Does Guardian store webhook tokens or webhook URLs?",
    answer:
      "No. Guardian intentionally excludes webhook tokens and webhook URLs from Black Box forensic storage.",
  },
  {
    question: "Can Guardian restore everything after an attack?",
    answer:
      "No. Discord limits what can be restored. Guardian preserves supported structural state and prepares recovery where the Discord API allows it.",
  },
  {
    question: "Does Guardian need Administrator?",
    answer:
      "The standard V1 installation uses Administrator so Guardian can monitor, provision, investigate and perform supported recovery operations without being blocked by missing permissions.",
  },
  {
    question: "Does Guardian require manual setup?",
    answer:
      "The standard installation is designed for zero manual setup. Guardian creates and maintains its required private control channels automatically.",
  },
  {
    question: "Is Guardian available now?",
    answer:
      "001 Guardian V1.0.0 is available for controlled early use. Public support, licensing and hosted service options are still being prepared.",
  },
]

function SupportFaq() {
  return (
    <section className="support-faq" id="support">
      <div className="support-intro">
        <div>
          <p className="eyebrow">
            SUPPORT / 001
          </p>

          <h2>
            Questions before
            <span> deployment?</span>
          </h2>
        </div>

        <div className="support-copy">
          <p>
            Guardian is built for servers where security infrastructure
            matters.
          </p>

          <span>
            Review the most common deployment and security questions before
            adding 001 Guardian to your Discord server.
          </span>
        </div>
      </div>

      <div className="faq-grid">
        {faqItems.map((item, index) => (
          <details className="faq-item" key={item.question}>
            <summary>
              <span className="faq-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <strong>
                {item.question}
              </strong>

              <span className="faq-toggle" aria-hidden="true">
                +
              </span>
            </summary>

            <div className="faq-answer">
              <p>
                {item.answer}
              </p>
            </div>
          </details>
        ))}
      </div>

      <div className="support-panel">
        <div>
          <p className="eyebrow">
            001 SECURITY LABS
          </p>

          <h3>
            Need help with Guardian?
          </h3>

          <p>
            Official customer support is being prepared. For now, Guardian is
            available as an early access security deployment.
          </p>
        </div>

        <div className="support-status">
          <span>
            SUPPORT NETWORK
          </span>

          <strong>
            COMING SOON
          </strong>
        </div>
      </div>
    </section>
  )
}

export default SupportFaq