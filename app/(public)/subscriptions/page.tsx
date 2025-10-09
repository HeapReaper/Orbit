"use client";

export default function Page() {
  const plans = [
    {
      name: "Free",
      description:
        "Perfect for trying out basic features and managing smaller servers.",
      price: "€0 / month",
      nonFeatures: [
        "No support"
      ],
      features: [
        "Free modules",
        "1 week log",
      ],
      buttonText: "Current plan",
      buttonClass:
        "bg-gray-700 cursor-not-allowed opacity-70 hover:bg-gray-700",
    },
    {
      name: "Premium",
      description:
        "Unlock advanced tools like the Anti Bot module and extended logs for better moderation.",
      price: "€1.99 / month or € 14.99 / year",
      features: [
        "Premium modules",
        "8 weeks logs",
        "Support"
      ],
      buttonText: "Upgrade to premium",
      buttonClass: "bg-blue-600 hover:bg-blue-700 cursor-not-allowed",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0d0f13] text-gray-300 px-6 md:px-20 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-1">
          Subscriptions
        </h1>
        <p className="text-gray-400 mb-10">
          <strong>(Coming soon)</strong> {" "}
          Choose the plan that fits your needs and unlock additional features
          for your server.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-[#14171f] rounded-lg p-6 shadow hover:shadow-lg transition border border-gray-800 hover:border-blue-600"
            >
              <h2 className="text-2xl font-semibold text-white mb-2">
                {plan.name}
              </h2>
              <p className="text-gray-400 mb-4">{plan.description}</p>
              <p className="text-gray-300 font-medium mb-4">{plan.price}</p>

              <ul className="mb-6 space-y-2">
                {plan.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-center">
                    <span className="mr-2 text-[var(--primary-color)]">✔</span> {feature}
                  </li>
                ))}

                {plan.nonFeatures && (
                  plan.nonFeatures.map((nonFeature: string, i: number) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-2 text-[var(--primary-color)]">✗</span> {nonFeature}
                    </li>
                  ))
                )}
              </ul>

              <button
                className={`w-full text-white px-4 py-2 rounded font-medium transition ${plan.buttonClass}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
