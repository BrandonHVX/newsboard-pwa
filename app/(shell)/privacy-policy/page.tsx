import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Heavy Status privacy policy — how we collect, use, and protect your information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 md:px-6">
      <h1 className="font-serif text-[34px] leading-[1.02] tracking-[-0.03em]">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

      <div className="prose prose-slate max-w-none mt-8 prose-headings:font-serif prose-a:underline prose-a:underline-offset-4">
        <section>
          <h2>Introduction</h2>
          <p>
            Heavy Status (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting
            your personal information. This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you visit our website at heavy-status.com and use our services,
            including our Progressive Web App.
          </p>
        </section>

        <section>
          <h2>Information We Collect</h2>

          <h3>Information You Provide</h3>
          <ul>
            <li><strong>Contact information</strong> — such as your email address, when you subscribe to notifications or contact us directly.</li>
            <li><strong>Push notification preferences</strong> — when you opt in to receive push notifications through our app.</li>
          </ul>

          <h3>Information Collected Automatically</h3>
          <ul>
            <li><strong>Device and browser information</strong> — including your device type, operating system, browser type, and screen resolution.</li>
            <li><strong>Usage data</strong> — such as pages visited, time spent on pages, referring URLs, and interaction patterns.</li>
            <li><strong>IP address</strong> — used for general geographic analysis and security purposes.</li>
            <li><strong>Cookies and similar technologies</strong> — to enhance your experience and analyze site usage.</li>
          </ul>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Deliver and maintain our news content and services.</li>
            <li>Send push notifications for breaking news, live coverage, and selected content (with your consent).</li>
            <li>Analyze usage patterns to improve our website and user experience.</li>
            <li>Respond to your inquiries and communications.</li>
            <li>Comply with legal obligations and protect our rights.</li>
          </ul>
        </section>

        <section>
          <h2>Push Notifications</h2>
          <p>
            We use OneSignal to deliver push notifications. When you opt in to notifications, OneSignal may
            collect a device identifier and notification preferences. You can opt out of push notifications
            at any time through your browser or device settings. We only send notifications for breaking news,
            live coverage, and selected editorial content.
          </p>
        </section>

        <section>
          <h2>Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to analyze traffic and improve your experience.
            Types of cookies we use include:
          </p>
          <ul>
            <li><strong>Essential cookies</strong> — required for basic site functionality.</li>
            <li><strong>Analytics cookies</strong> — help us understand how visitors interact with our site.</li>
            <li><strong>Preference cookies</strong> — remember your settings and preferences.</li>
          </ul>
          <p>
            You can control cookies through your browser settings. Disabling certain cookies may affect
            site functionality.
          </p>
        </section>

        <section>
          <h2>Third-Party Services</h2>
          <p>We may use the following third-party services that collect information:</p>
          <ul>
            <li><strong>OneSignal</strong> — for push notification delivery. <a href="https://onesignal.com/privacy_policy" target="_blank" rel="noopener noreferrer">OneSignal Privacy Policy</a></li>
            <li><strong>WordPress/WPGraphQL</strong> — our content management system.</li>
            <li><strong>Analytics providers</strong> — to measure and analyze site traffic.</li>
          </ul>
        </section>

        <section>
          <h2>Data Retention</h2>
          <p>
            We retain your personal information only for as long as necessary to fulfill the purposes
            described in this policy, or as required by law. Push notification subscriptions remain active
            until you unsubscribe.
          </p>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Request deletion of your personal information.</li>
            <li>Opt out of push notifications and marketing communications.</li>
            <li>Withdraw consent where processing is based on consent.</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at{" "}
            <a href="mailto:contact@heavy-status.com">contact@heavy-status.com</a>.
          </p>
        </section>

        <section>
          <h2>Children&apos;s Privacy</h2>
          <p>
            Our services are not directed to children under the age of 13. We do not knowingly collect
            personal information from children. If you believe we have collected information from a child,
            please contact us immediately.
          </p>
        </section>

        <section>
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with
            an updated revision date. We encourage you to review this policy periodically.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy, please contact us at:
          </p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:contact@heavy-status.com">contact@heavy-status.com</a></li>
            <li><strong>Website:</strong> <a href="https://heavy-status.com">heavy-status.com</a></li>
          </ul>
        </section>
      </div>
    </article>
  );
}
