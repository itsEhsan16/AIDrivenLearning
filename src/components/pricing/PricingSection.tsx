import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardSpotlight } from "./CardSpotlight";

const PricingTier = ({
  name,
  price,
  description,
  features,
  isPopular,
  buttonText,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText?: string;
}) => (
  <CardSpotlight className={`h-full ${isPopular ? "border-primary" : "border-white/10"} border-2`}>
    <div className="relative h-full p-6 flex flex-col">
      {isPopular && (
        <span className="text-xs font-medium bg-primary/10 text-primary rounded-full px-3 py-1 w-fit mb-4">
          Most Popular
        </span>
      )}
      <h3 className="text-xl font-medium mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold">{price}</span>
        {price !== "Custom" && <span className="text-gray-400">/month</span>}
      </div>
      <p className="text-gray-400 mb-6">{description}</p>
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            <span className="text-sm text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <Button className="button-gradient w-full">
        {buttonText || 'Upgrade'}
      </Button>
    </div>
  </CardSpotlight>
);

export const PricingSection = () => {
  return (
    <section className="container px-4 py-24">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-normal mb-6"
        >
          Choose Your{" "}
          <span className="text-gradient font-medium">Learning Plan</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-lg text-gray-400"
        >
          Select the perfect plan to accelerate your learning with personalized AI guidance and advanced features.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <PricingTier
          name="Starter"
          price="Free"
          description="Perfect for casual learners or those trying the platform."
          features={[
            "Personalized learning roadmap (basic)",
            "Access to 100+ skills",
            "Progress tracking",
            "Access to Basic Models"
          ]}
          buttonText="Start Learning"
        />
        <PricingTier
          name="Pro Learner"
          price="₹ 199"
          description="Advanced features for serious learners."
          features={[
            "Everything in Starter",
            "Advanced AI roadmap customization",
            "Access to all 500+ skills",
            "Access to Pro Models",
            "Priority AI support (24/7)",
            "Detailed analytics & reports",
            "Integration with calendar & reminders",
            "Community support"
          ]}
          isPopular
          buttonText="Upgrade"
        />
        <PricingTier
          name="Enterprise"
          price="Custom"
          description="Custom AI solutions for organizations and institutions."
          features={[
            "Custom AI Learner",
            "Everything in Pro Learner",
            "Team/organization management",
            "Custom onboarding & training",
            "Dedicated account manager",
            "API access & integrations",
            "Custom analytics dashboard"
          ]}
          buttonText="Create new team"
        />
      </div>
    </section>
  );
};