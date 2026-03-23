import { motion } from "framer-motion";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: "₹0",
      period: "month",
      icon: "🌱",
      features: [
        "10 analyses per month",
        "Basic sentiment analysis",
        "Email support",
        "3 months data history",
      ],
      color: "#4a90e2",
    },
    {
      name: "Pro",
      price: "₹120",
      period: "month",
      icon: "🚀",
      features: [
        "100 analyses per month",
        "Advanced sentiment with flags",
        "Priority support",
        "12 months data history",
        "Portfolio tracking",
        "Export reports",
      ],
      color: "#767170",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "₹320",
      period: "month",
      icon: "🏢",
      features: [
        "Unlimited analyses",
        "Real-time monitoring",
        "Dedicated account manager",
        "Unlimited history",
        "API access",
        "Team accounts (5 seats)",
        "Custom integrations",
      ],
      color: "#767170",
    },
  ];

  const handleGetStarted = (planName) => {
    if (isSignedIn) {
      navigate("/analyze");
    } else {
      // Show sign in modal
      document.querySelector('[data-clerk-component="SignInButton"]')?.click();
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: "center", marginBottom: "50px" }}
      >
        <h1 style={{ color: "#fff", fontSize: "42px", marginBottom: "15px" }}>
          Simple, Transparent Pricing
        </h1>
        <p style={{ color: "#aaa", fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}>
          Choose the plan that's right for your investment journey
        </p>
      </motion.div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}>
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            style={{
              backgroundColor: "#2d2d2d",
              borderRadius: "20px",
              padding: "30px",
              border: plan.popular ? `2px solid ${plan.color}` : "1px solid #444",
              position: "relative",
              boxShadow: plan.popular ? `0 10px 30px ${plan.color}20` : "none",
            }}
          >
            {plan.popular && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                  position: "absolute",
                  top: "-12px",
                  right: "20px",
                  backgroundColor: plan.color,
                  color: "#fff",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                MOST POPULAR
              </motion.div>
            )}

            <div style={{ fontSize: "48px", marginBottom: "20px" }}>{plan.icon}</div>
            <h2 style={{ color: "#fff", fontSize: "28px", margin: "0 0 10px 0" }}>
              {plan.name}
            </h2>
            <div style={{ marginBottom: "20px" }}>
              <span style={{ color: "#fff", fontSize: "36px", fontWeight: "bold" }}>
                {plan.price}
              </span>
              <span style={{ color: "#aaa", fontSize: "16px" }}> /{plan.period}</span>
            </div>

            <ul style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 30px 0",
            }}>
              {plan.features.map((feature, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  style={{
                    color: "#aaa",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span style={{ color: "#4caf50" }}>✓</span>
                  {feature}
                </motion.li>
              ))}
            </ul>

            {!isSignedIn ? (
              <SignInButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: plan.popular ? plan.color : "transparent",
                    color: plan.popular ? "#fff" : plan.color,
                    border: `2px solid ${plan.color}`,
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  Get Started
                </motion.button>
              </SignInButton>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleGetStarted(plan.name)}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: plan.popular ? plan.color : "transparent",
                  color: plan.popular ? "#fff" : plan.color,
                  border: `2px solid ${plan.color}`,
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {isSignedIn ? "Start Analyzing" : "Get Started"}
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        style={{
          marginTop: "60px",
          backgroundColor: "#2d2d2d",
          borderRadius: "20px",
          padding: "40px",
          border: "1px solid #444",
        }}
      >
        <h2 style={{ color: "#fff", textAlign: "center", marginBottom: "30px" }}>
          Frequently Asked Questions
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "30px",
        }}>
          {[
            {
              q: "Can I cancel anytime?",
              a: "Yes, you can cancel your subscription at any time. No questions asked."
            },
            {
              q: "Is there a free trial?",
              a: "We offer a 7-day free trial on all paid plans. No credit card required."
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit cards, PayPal, and cryptocurrency."
            },
            {
              q: "Do you offer refunds?",
              a: "Yes, we offer a 30-day money-back guarantee if you're not satisfied."
            },
          ].map((faq, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 5 }}
              style={{
                padding: "20px",
                backgroundColor: "#333",
                borderRadius: "10px",
              }}
            >
              <h3 style={{ color: "#fff", margin: "0 0 10px 0" }}>{faq.q}</h3>
              <p style={{ color: "#aaa", margin: "0", lineHeight: "1.6" }}>{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}