import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserGoals } from "@/pages/Learning";
import { Brain, Clock, Target, Code, ArrowRight } from "lucide-react";

interface GoalFormProps {
  onSubmit: (goals: UserGoals) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

const commonSkills = [
  "HTML", "CSS", "JavaScript", "Python", "React", "Node.js", "Git", 
  "TypeScript", "Vue.js", "Angular", "PHP", "Java", "C++", "SQL", 
  "MongoDB", "Docker", "AWS", "Firebase", "Express.js", "Django"
];

const learningStyles = [
  "Video Tutorials", "Written Articles", "Hands-on Projects", 
  "Interactive Coding", "Documentation", "Books"
];

export const GoalForm = ({ onSubmit, isGenerating, setIsGenerating }: GoalFormProps) => {
  const [goal, setGoal] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState("");
  const [dailyCommitment, setDailyCommitment] = useState("");
  const [learningStyle, setLearningStyle] = useState<string[]>([]);
  const [customSkills, setCustomSkills] = useState("");

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal || !timeframe || !dailyCommitment || learningStyle.length === 0) return;

    // Split customSkills by comma, trim, and filter out empty strings
    const customSkillsArray = customSkills
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
    const allSkills = Array.from(new Set([...selectedSkills, ...customSkillsArray]));

    const goals: UserGoals = {
      goal,
      currentSkills: allSkills,
      timeframe,
      dailyCommitment,
      learningStyle // now an array
    };

    setIsGenerating(true);
    onSubmit(goals);
  };

  const toggleLearningStyle = (style: string) => {
    setLearningStyle(prev =>
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Define Your <span className="text-gradient">Learning Goals</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Tell us about your objectives and we'll create a personalized roadmap just for you
        </p>
      </div>

      <Card className="glass max-w-4xl mx-auto border-white/10">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Learning Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Goal Definition */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <Label htmlFor="goal" className="text-lg flex items-center gap-2 text-foreground">
                <Brain className="w-5 h-5 text-primary" />
                What do you want to learn?
              </Label>
              <Input
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Become a Frontend Developer, Learn Python for Data Science"
                className="text-lg p-4 bg-background/50 border-white/20 focus:border-primary"
                required
              />
            </motion.div>

            {/* Current Skills */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <Label className="text-lg flex items-center gap-2 text-foreground">
                <Code className="w-5 h-5 text-primary" />
                What technologies do you already know?
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {commonSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-300 p-3 text-center justify-center ${
                      selectedSkills.includes(skill) 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "border-white/20 hover:border-primary/50 hover:bg-primary/10"
                    }`}
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              {/* Custom tech stack input */}
              <div className="mt-4">
                <Label htmlFor="customSkills" className="text-base text-foreground">Other technologies (comma separated)</Label>
                <Input
                  id="customSkills"
                  value={customSkills}
                  onChange={e => setCustomSkills(e.target.value)}
                  placeholder="e.g., Svelte, Rust, Flutter, Go, ..."
                  className="mt-2 p-3 bg-background/50 border-white/20 focus:border-primary"
                />
                <div className="text-xs text-muted-foreground mt-1">If your tech stack isn't listed above, add it here. Separate multiple with commas.</div>
              </div>
            </motion.div>

            {/* Timeframe and Commitment */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <Label htmlFor="timeframe" className="text-lg flex items-center gap-2 text-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  How long do you have?
                </Label>
                <select
                  id="timeframe"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full p-4 rounded-md border border-white/20 bg-background/50 text-foreground focus:border-primary focus:outline-none"
                  required
                >
                  <option value="">Select timeframe</option>
                  <option value="1 month">1 Month</option>
                  <option value="2 months">2 Months</option>
                  <option value="3 months">3 Months</option>
                  <option value="6 months">6 Months</option>
                  <option value="1 year">1 Year</option>
                </select>
              </div>

              <div className="space-y-4">
                <Label htmlFor="commitment" className="text-lg text-foreground">
                  Daily time commitment
                </Label>
                <select
                  id="commitment"
                  value={dailyCommitment}
                  onChange={(e) => setDailyCommitment(e.target.value)}
                  className="w-full p-4 rounded-md border border-white/20 bg-background/50 text-foreground focus:border-primary focus:outline-none"
                  required
                >
                  <option value="">Select commitment</option>
                  <option value="30 minutes">30 minutes/day</option>
                  <option value="1 hour">1 hour/day</option>
                  <option value="2 hours">2 hours/day</option>
                  <option value="3 hours">3 hours/day</option>
                  <option value="4+ hours">4+ hours/day</option>
                </select>
              </div>
            </motion.div>

            {/* Learning Style */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <Label className="text-lg text-foreground">Preferred learning style <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {learningStyles.map((style) => (
                  <Badge
                    key={style}
                    variant={learningStyle.includes(style) ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-300 p-3 text-center justify-center ${
                      learningStyle.includes(style)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-white/20 hover:border-primary/50 hover:bg-primary/10"
                    }`}
                    onClick={() => toggleLearningStyle(style)}
                  >
                    {style}
                  </Badge>
                ))}
              </div>
              {learningStyle.length === 0 && (
                <div className="text-red-500 text-sm mt-2">Please select at least one learning style.</div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                type="submit" 
                size="lg" 
                className="w-full button-gradient text-lg py-6"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Generating Roadmap...
                  </>
                ) : (
                  <>
                    Generate My Learning Roadmap
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
