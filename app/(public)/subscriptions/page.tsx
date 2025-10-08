import React from "react";

const plans = [
  {
    name: "Gratis",
    price: "€0 / maand",
    features: [
      "1 bot",
      "Beperkte logs",
      "Geen premium commands",
    ],
    buttonText: "Selecteer gratis",
    buttonClass: "bg-gray-500 hover:bg-gray-600",
  },
  {
    name: "Premium",
    price: "€9,99 / maand",
    features: [
      "Tot 5 bots",
      "Volledige logs",
      "Alle premium commands",
      "Prioriteitssupport",
    ],
    buttonText: "Upgrade naar premium",
    buttonClass: "bg-blue-600 hover:bg-blue-700",
  },
];

export default function Subscriptions() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Abonnementen</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="border rounded-lg p-6 shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-gray-700 mb-4">{plan.price}</p>
            <ul className="mb-6 space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <span className="mr-2 text-green-500">✔</span> {feature}
                </li>
              ))}
            </ul>
            <button
              className={`text-white px-4 py-2 rounded ${plan.buttonClass}`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}