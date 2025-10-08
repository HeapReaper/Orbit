"use client";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0d0f13] text-gray-300 px-6 md:px-20 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-10">
          Privacy Policy
        </h1>

        <p className="text-gray-400 mb-10">
          Last updated: 10/08/2025
        </p>

        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              Your privacy is important to us. This Privacy Policy explains how Orbit collects,
              uses, and protects your personal information when you access or use our platform,
              dashboard, or Discord integrations.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">2. Information We Collect</h2>
            <p>
              We may collect personal information such as your Discord account details, usage data,
              and any information you provide directly through the platform. We do not sell your
              data to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <p>
              Your information is used to provide and improve our services, manage your account,
              send important updates, and comply with legal obligations.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">4. Data Sharing</h2>
            <p>
              We do not share your personal information with third parties except when necessary
              to provide our services, comply with the law, or protect our rights and users.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">5. Security</h2>
            <p>
              We implement reasonable security measures to protect your information. However,
              no method of transmission over the internet is 100% secure.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">6. Your Rights</h2>
            <p>
              You may request access, correction, or deletion of your personal data. Contact us
              if you have any questions or concerns about your data.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Any changes will be posted on this
              page with the effective date. Continued use of Orbit means you accept the updated policy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">8. Contact</h2>
            <p>
              For privacy questions, please contact us at{" "}
              <a
                href="mailto:support@heapreaper.nl"
                className="text-[var(--primary-color)] hover:underline"
              >
                support@heapreaper.nl
              </a>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
