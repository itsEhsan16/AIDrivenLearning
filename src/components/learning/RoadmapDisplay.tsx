import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Calendar, Clock, CheckCircle2, Circle, Play, BarChart3 } from "lucide-react";
import { UserGoals, Roadmap, Task } from "@/pages/Learning";
import { generateRoadmapWithAI } from "@/utils/geminiApi";

interface RoadmapDisplayProps {
  userGoals: UserGoals;
  onRoadmapGenerated: (roadmap: Roadmap) => void;
  onBack: () => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

export const RoadmapDisplay = ({ 
  userGoals, 
  onRoadmapGenerated, 
  onBack, 
  isGenerating, 
  setIsGenerating 
}: RoadmapDisplayProps) => {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [error, setError] = useState<string>("");
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  useEffect(() => {
    generateRoadmap();
  }, []);

  const generateRoadmap = async () => {
    try {
      setIsGenerating(true);
      setError("");
      const generatedRoadmap = await generateRoadmapWithAI(userGoals);
      setRoadmap(generatedRoadmap);
    } catch (err) {
      setError("Failed to generate roadmap. Please try again.");
      console.error("Error generating roadmap:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartLearning = () => {
    if (roadmap) {
      onRoadmapGenerated(roadmap);
    }
  };

  if (isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="glass rounded-xl p-12 max-w-md mx-auto border-white/10">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"></div>
          <h3 className="text-2xl font-semibold mb-4">Generating Your Roadmap</h3>
          <p className="text-muted-foreground text-lg">
            AI is creating a personalized learning path for you...
          </p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <Card className="glass max-w-md mx-auto border-white/10">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Circle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-red-400">Generation Failed</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="space-y-3">
              <Button onClick={generateRoadmap} className="w-full button-gradient">
                Try Again
              </Button>
              <Button onClick={onBack} variant="outline" className="w-full border-white/20">
                Back to Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!roadmap) return null;

  const weeklyTasks = roadmap.tasks.reduce((acc, task) => {
    const week = task.week;
    if (!acc[week]) acc[week] = [];
    acc[week].push(task);
    return acc;
  }, {} as Record<number, Task[]>);

  const weekNumbers = Object.keys(weeklyTasks).map(Number).sort((a, b) => a - b);
  const selectedWeekTasks = weeklyTasks[selectedWeek] || [];

  // Progress calculations
  const totalTasks = roadmap.tasks.length;
  const completedTasks = roadmap.tasks.filter(t => t.completed).length;
  const overallProgress = Math.round((completedTasks / totalTasks) * 100);
  const weekTotalTasks = selectedWeekTasks.length;
  const weekCompletedTasks = selectedWeekTasks.filter(t => t.completed).length;
  const weekProgress = weekTotalTasks ? Math.round((weekCompletedTasks / weekTotalTasks) * 100) : 0;

  // Sidebar week progress
  const getWeekProgress = (week: number) => {
    const tasks = weeklyTasks[week] || [];
    if (!tasks.length) return 0;
    const done = tasks.filter(t => t.completed).length;
    return Math.round((done / tasks.length) * 100);
  };

  // Toggle task completion (for demo, not persisted)
  const toggleTaskCompletion = (taskId: string) => {
    if (!roadmap) return;
    const updatedTasks = roadmap.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setRoadmap({ ...roadmap, tasks: updatedTasks });
  };

  return (
    <>
      {/* Mobile Heading/Description */}
      <div className="text-center mb-2 md:hidden">
        <h2 className="text-3xl font-bold mb-2">
          Your <span className="text-gradient">Learning Roadmap</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          AI has crafted a personalized learning journey based on your goals and preferences
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:gap-8 gap-4 items-start"
      >
        {/* Sidebar */}
        <aside className="w-full mb-4 md:mb-0 md:w-64 flex-shrink-0">
          <Card className="glass border-white/10 sticky top-24 w-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Weeks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {weekNumbers.map((week) => (
                  <Button
                    key={week}
                    variant={selectedWeek === week ? "default" : "outline"}
                    onClick={() => setSelectedWeek(week)}
                    className={`justify-between w-full px-4 py-3 rounded-lg flex items-center ${selectedWeek === week ? "button-gradient" : "border-white/20 hover:border-primary/50"}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-bold">Week {week}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">{getWeekProgress(week)}%</span>
                  </Button>
                ))}
              </div>
              <div className="mt-8">
                <div className="text-xs text-muted-foreground mb-1">Overall Progress</div>
                <Progress value={overallProgress} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">{overallProgress}% complete</div>
              </div>
              <Button onClick={onBack} variant="outline" className="mt-8 w-full border-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Goals
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full">
          {/* Desktop Heading/Description */}
          <div className="text-center mb-2 hidden md:block">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Your <span className="text-gradient">Learning Roadmap</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              AI has crafted a personalized learning journey based on your goals and preferences
            </p>
          </div>
          <Card className="glass border-white/10 w-full">
            <CardHeader>
              <CardTitle className="text-2xl text-center">{roadmap.title}</CardTitle>
              <p className="text-muted-foreground text-center text-lg">{roadmap.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                <div className="text-center p-4 md:p-6 glass rounded-lg">
                  <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-primary">{roadmap.totalWeeks}</div>
                  <div className="text-muted-foreground">Weeks</div>
                </div>
                <div className="text-center p-4 md:p-6 glass rounded-lg">
                  <BarChart3 className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-primary">{roadmap.tasks.length}</div>
                  <div className="text-muted-foreground">Learning Tasks</div>
                </div>
                <div className="text-center p-4 md:p-6 glass rounded-lg">
                  <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-primary">{overallProgress}%</div>
                  <div className="text-muted-foreground">Complete</div>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm text-muted-foreground">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-3" />
              </div>
              <Button onClick={handleStartLearning} className="w-full button-gradient text-lg py-6">
                <Play className="mr-2 w-5 h-5" /> Start Learning Journey
              </Button>
            </CardContent>
          </Card>
          {/* Selected Week Content */}
          <Card className="glass border-white/10 w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">{selectedWeek}</span>
                </div>
                Week {selectedWeek}
                <span className="ml-4 text-sm text-muted-foreground">{weekProgress}% complete</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedWeekTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 p-3 md:p-4 rounded-lg bg-background/30 border border-white/10 hover:border-white/20 transition-colors w-full"
                  >
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className="mt-1 mb-2 sm:mb-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2">
                        <h4 className="font-medium text-base md:text-lg">Day {task.day}: {task.title}</h4>
                        <div className="flex items-center gap-1 text-xs md:text-sm text-primary bg-primary/10 px-2 py-1 rounded">
                          <Clock className="w-3 h-3" />
                          {task.estimatedTime}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3 text-sm md:text-base">{task.description}</p>
                      {task.resources && task.resources.length > 0 && (
                        <div className="bg-background/50 rounded-lg p-3">
                          <p className="text-xs md:text-sm font-medium text-primary mb-2">Resources:</p>
                          <ul className="text-xs md:text-sm text-muted-foreground space-y-1">
                            {task.resources.map((resource, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                {resource}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </motion.div>
    </>
  );
};
