// src/pages/PricingPage.tsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const pricingTiers = [
  {
    name: "Starter",
    price: "$0",
    frequency: "/month",
    description: "For individuals and small personal projects.",
    features: ["Up to 10 projects", "Basic task management", "2 collaborators", "Community support"],
    cta: "Get Started",
    isPopular: false,
  },
  {
    name: "Pro",
    price: "$12",
    frequency: "/user/month",
    description: "For small teams that need to collaborate and track progress.",
    features: [
      "Unlimited projects",
      "Advanced task management",
      "Up to 15 collaborators",
      "Productivity dashboard",
      "Priority email support",
    ],
    cta: "Choose Pro",
    isPopular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    frequency: "",
    description: "For large organizations with advanced security and support needs.",
    features: [
      "Everything in Pro",
      "Role-based access control",
      "SAML SSO integration",
      "Dedicated account manager",
      "24/7 premium support",
    ],
    cta: "Contact Sales",
    isPopular: false,
  },
];

const PricingPage: React.FC = () => {
  // Default selected plan is 'Pro'
  const [selectedPlan, setSelectedPlan] = useState<string>("Pro");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-purple-700 dark:from-purple-900 dark:to-gray-900 text-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header section remains the same */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white dark:text-purple-200 drop-shadow-lg">
            Choose the Plan That's Right for You
          </h1>
          <p className="mt-4 text-lg md:text-xl text-purple-100 dark:text-purple-300 max-w-2xl mx-auto">
            Simple, transparent pricing. No hidden fees.
          </p>
        </motion.div>

        <div className="mt-16 grid max-w-lg gap-8 mx-auto lg:max-w-none lg:grid-cols-3">
          {pricingTiers.map((tier, index) => {
            const isSelected = selectedPlan === tier.name;

            return (
              <motion.div
                key={tier.name}
                onClick={() => setSelectedPlan(tier.name)}
                // --- CHANGE 1: DYNAMIC CARD STYLING ---
                // The card's style now depends entirely on whether it is selected.
                className={`
                  rounded-lg shadow-lg p-8 flex flex-col cursor-pointer transition-all duration-300 border-2
                  ${isSelected
                    ? 'bg-purple-800 dark:bg-purple-900 border-purple-400' // Selected style (same as old 'popular' style)
                    : 'bg-white/10 dark:bg-gray-800/50 border-transparent' // Default style for unselected cards
                  }
                `}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                {/* The "Most Popular" badge is independent of selection. It only shows on the Pro plan. */}
                {tier.isPopular && (
                  <div className="text-center mb-4 h-6"> {/* Added h-6 for consistent spacing */}
                    <span className="bg-purple-400 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</span>
                  </div>
                )}
                {/* Add a placeholder if not popular to prevent layout shift */}
                {!tier.isPopular && <div className="h-6 mb-4"></div>}

                <h3 className="text-2xl font-bold text-center text-white">{tier.name}</h3>
                <div className="mt-4 text-center text-purple-100">
                  <span className="text-4xl font-extrabold text-white">{tier.price}</span>
                  <span className="text-base font-medium">{tier.frequency}</span>
                </div>
                <p className="mt-4 text-center text-purple-200 h-12">{tier.description}</p>
                
                <ul className="mt-8 space-y-4 text-sm text-purple-100 flex-grow">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg className="flex-shrink-0 h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-3">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={tier.name === 'Enterprise' ? '/contact-sales' : '/register'}
                  // --- CHANGE 2: DYNAMIC BUTTON STYLING ---
                  // The button's style also changes based on selection.
                  className={`
                    mt-8 block w-full text-center rounded-lg px-6 py-3 text-lg font-semibold transition-colors
                    ${isSelected
                      ? 'bg-white text-purple-700 hover:bg-purple-100' // Selected button style
                      : 'bg-purple-600 text-white hover:bg-purple-700' // Default button style
                    }
                  `}
                >
                  {isSelected ? "Continue with " + tier.name : tier.cta}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;