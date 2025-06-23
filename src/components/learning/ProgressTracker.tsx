
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Trophy,
  Target,
  Flame,
  TrendingUp,
  BookOpen
} from "lucide-react";
import { Roadmap, Task } from "@/pages/Learning";

interface ProgressTrackerProps {
  roadmap: Roadmap;
  setRoadmap: (roadmap: Roadmap) => void;
  onBack: () => void;
}

export const ProgressTracker = ({ roadmap, setRoadmap, onBack }: ProgressTrackerProps) => {
  const [selectedWeek, setSelectedWeek] = useState(1);

  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = roadmap.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    const completedTasks = updatedTasks.filter(task => task.completed).length;
    const progress = Math.round((completedTasks / updatedTasks.length) * 100);
    
    const updatedRoadmap = {
      ...roadmap,
      tasks: updatedTasks,
      progress
    };
    
    setRoadmap(updatedRoadmap);
  };

  const completedTasks = roadmap.tasks.filter(task => task.completed).length;
  const totalTasks = roadmap.tasks.length;
  const currentStreak = 7;

  const weeklyTasks = roadmap.tasks.reduce((acc, task) => {
    const week = task.week;
    if (!acc[week]) acc[week] = [];
    acc[week].push(task);
    return acc;
  }, {} as Record<number, Task[]>);

  const currentWeekTasks = weeklyTasks[selectedWeek] || [];
  const todaysTasks = currentWeekTasks.filter(task => task.day === new Date().getDate() % 7 + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <Button onClick={onBack} variant="outline" className="mb-6 border-white/20">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Goals
        </Button>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your <span className="text-gradient">Learning Progress</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your advancement and stay motivated on your learning journey
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="glass border-white/10">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-primary">{roadmap.progress}%</div>
            <div className="text-sm text-muted-foreground">Complete</div>
          </CardContent>
        </Card>
        
        <Card className="glass border-white/10">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-primary">{completedTasks}/{totalTasks}</div>
            <div className="text-sm text-muted-foreground">Tasks Done</div>
          </CardContent>
        </Card>
        
        <Card className="glass border-white/10">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-primary">{currentStreak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
        
        <Card className="glass border-white/10">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-primary">Week {selectedWeek}</div>
            <div className="text-sm text-muted-foreground">Current</div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card className="glass border-white/10 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-primary" />
            {roadmap.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Overall Progress</span>
              <span className="text-sm text-primary font-medium">{roadmap.progress}%</span>
            </div>
            <Progress value={roadmap.progress} className="h-3" />
          </div>
          <p className="text-muted-foreground">{roadmap.description}</p>
        </CardContent>
      </Card>

      {/* Today's Tasks */}
      {todaysTasks.length > 0 && (
        <Card className="glass border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              Today's Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20 hover:border-primary/30 transition-colors"
                >
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className="mt-1"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground hover:text-primary" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className={`font-medium text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </h4>
                      <Badge variant="secondary" className="bg-primary/20 text-primary">
                        <Clock className="w-3 h-3 mr-1" />
                        {task.estimatedTime}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{task.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Week Navigation */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {Object.keys(weeklyTasks)
  .map(Number)
  .sort((a, b) => a - b)
  .map((week) => (
    <Button
      key={week}
      variant={selectedWeek === week ? "default" : "outline"}
      onClick={() => setSelectedWeek(week)}
      className={`min-w-[80px] ${selectedWeek === week ? "button-gradient" : "border-white/20 hover:border-primary/50"}`}
    >
      Week {week}
    </Button>
))}
      </div>

      {/* Weekly Tasks */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary" />
            Week {selectedWeek} Learning Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentWeekTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-lg bg-background/30 border border-white/10 hover:border-white/20 transition-colors"
              >
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className="mt-1"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground hover:text-primary" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className={`font-medium text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      Day {task.day}: {task.title}
                    </h4>
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      <Clock className="w-3 h-3 mr-1" />
                      {task.estimatedTime}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{task.description}</p>
                  {task.resources && task.resources.length > 0 && (
                    <div className="bg-background/50 rounded-lg p-3">
                      <p className="text-sm font-medium text-primary mb-2">Learning Resources:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
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
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
