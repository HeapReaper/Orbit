"use client";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-[#0d0f13] text-gray-300 px-6 md:px-20 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-10">
          Terms of Service
        </h1>

        <p className="text-gray-400 mb-10">
          Last updated: 09/08/2025
        </p>

        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              Welcome to Orbit. By accessing or using our platform, dashboard, or
              Discord integrations, you agree to these Terms of Service. Please read them
              carefully before using any of our services. If you do not agree, you may not
              use Orbit or any related features.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">2. Eligibility</h2>
            <p>
              You must be at least 13 years old to use Orbit. By using our services, you
              confirm that you meet this requirement and that you comply with all applicable
              laws and Discord’s Terms of Service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">3. Use of Service</h2>
            <p>
              Orbit provides tools for managing Discord bots, modules, and server
              configurations. You agree to use these tools responsibly and only for
              legitimate purposes. You may not:
            </p>
            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>Attempt to disrupt or overload Orbit or its servers.</li>
              <li>Use the platform for malicious, illegal, or abusive purposes.</li>
              <li>Reverse engineer, copy, or redistribute any part of the service.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">4. Account & Security</h2>
            <p>
              You are responsible for maintaining the security of your account and Discord
              credentials. Orbit is not liable for losses or damages resulting from
              unauthorized access caused by your actions or negligence.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">5. Third-Party Services</h2>
            <p>
              Orbit integrates with Discord and may use other third-party APIs. We are not
              responsible for any issues, downtime, or data policies of these third-party
              platforms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">6. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to Orbit at any time,
              with or without notice, if you violate these Terms or abuse the platform in
              any way.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">7. Limitation of Liability</h2>
            <p>
              Orbit and its developers shall not be held liable for any damages, losses, or
              data breaches resulting from the use or inability to use our services. All
              tools are provided “as is” without warranties of any kind.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">8. Changes to Terms</h2>
            <p>
              We may update these Terms of Service from time to time. Updates will be posted
              on this page with the new effective date. Continued use of Orbit after
              changes means you accept the updated terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">9. Contact</h2>
            <p>
              For any questions or concerns about these Terms, please contact us at{" "}
              <a
                href="mailto:support@orbit.gg"
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
