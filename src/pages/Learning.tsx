import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { GoalForm } from "@/components/learning/GoalForm";
import { RoadmapDisplay } from "@/components/learning/RoadmapDisplay";
import { ProgressTracker } from "@/components/learning/ProgressTracker";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Brain, Target, TrendingUp } from "lucide-react";

export interface UserGoals {
  goal: string;
  currentSkills: string[];
  timeframe: string;
  dailyCommitment: string;
  learningStyle: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  day: number;
  week: number;
  estimatedTime: string;
  resources?: string[];
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  totalWeeks: number;
  tasks: Task[];
  createdAt: Date;
  progress: number;
}

const Learning = () => {
  const [currentStep, setCurrentStep] = useState<'input' | 'roadmap' | 'progress'>('input');
  const [userGoals, setUserGoals] = useState<UserGoals | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGoalsSubmit = (goals: UserGoals) => {
    setUserGoals(goals);
    setCurrentStep('roadmap');
  };

  const handleRoadmapGenerated = (generatedRoadmap: Roadmap) => {
    setRoadmap(generatedRoadmap);
    setCurrentStep('progress');
  };

  const handleBackToInput = () => {
    setCurrentStep('input');
    setUserGoals(null);
    setRoadmap(null);
  };

  return (
    <div className="min-h-screen bg-black text-foreground pt-28">
      <Navigation />
      
      {/* Hero Section */}
      {/* (Removed hero section code) */}

      {/* Learning Platform Content */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="container px-4 pb-20"
      >
        <div className="max-w-6xl mx-auto">
          {currentStep === 'input' && (
            <GoalForm 
              onSubmit={handleGoalsSubmit}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
          )}

          {currentStep === 'roadmap' && userGoals && (
            <RoadmapDisplay
              userGoals={userGoals}
              onRoadmapGenerated={handleRoadmapGenerated}
              onBack={handleBackToInput}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
          )}

          {currentStep === 'progress' && roadmap && (
            <ProgressTracker
              roadmap={roadmap}
              setRoadmap={setRoadmap}
              onBack={handleBackToInput}
            />
          )}
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default Learning;
