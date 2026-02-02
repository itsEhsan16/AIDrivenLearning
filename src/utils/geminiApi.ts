import { GoogleGenerativeAI } from "@google/generative-ai";
import { UserGoals, Roadmap, Task } from "@/pages/Learning";
import { cacheRoadmap, getCachedRoadmap } from "@/lib/utils";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

if (!API_KEY) {
  throw new Error(
    "Missing Google Gemini API Key. Please set VITE_GEMINI_API_KEY in your .env.local file.",
  );
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Utility to parse timeframe string to weeks
function parseTimeframeToWeeks(timeframe: string): number {
  if (!timeframe) return 4;
  const lower = timeframe.toLowerCase();
  if (lower.includes("month")) {
    const match = lower.match(/(\d+)/);
    return match ? parseInt(match[1], 10) * 4 : 4;
  }
  if (lower.includes("week")) {
    const match = lower.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 4;
  }
  return 4;
}

// Utility to clean and validate JSON from AI, now with a robust nested structure
function cleanAndValidateRoadmapJson(
  text: string,
  expectedWeeks: number,
): any | null {
  let jsonText = text.trim();

  // Remove markdown code block if present (robust)
  jsonText = jsonText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  // Find the start and end of the JSON object
  const startIndex = jsonText.indexOf("{");
  const endIndex = jsonText.lastIndexOf("}");

  if (startIndex === -1 || endIndex === -1) {
    console.error("[Validation] No JSON object found in the response.");
    return null;
  }

  // Extract the JSON string
  jsonText = jsonText.substring(startIndex, endIndex + 1);

  // Auto-fix truncated JSON: balance brackets
  const openCurly = (jsonText.match(/\{/g) || []).length;
  const closeCurly = (jsonText.match(/\}/g) || []).length;
  const openSquare = (jsonText.match(/\[/g) || []).length;
  const closeSquare = (jsonText.match(/\]/g) || []).length;
  let fixedJson = jsonText;
  if (openSquare > closeSquare)
    fixedJson += "]".repeat(openSquare - closeSquare);
  if (openCurly > closeCurly) fixedJson += "}".repeat(openCurly - closeCurly);

  try {
    const roadmapData = JSON.parse(fixedJson);

    // Validate main structure
    if (
      !roadmapData ||
      !Array.isArray(roadmapData.weeks) ||
      typeof roadmapData.title !== "string"
    ) {
      return null;
    }

    // Validate week count
    if (roadmapData.weeks.length < expectedWeeks) {
      return null;
    }

    const weekTitleSet = new Set<string>();
    const taskTitleSet = new Set<string>();

    for (const week of roadmapData.weeks) {
      // Check for duplicate week titles
      if (!week.title || weekTitleSet.has(week.title)) return null;
      weekTitleSet.add(week.title);

      if (!Array.isArray(week.tasks)) return null;

      for (const task of week.tasks) {
        // Check for duplicate task titles
        if (!task.title || taskTitleSet.has(task.title)) return null;
        taskTitleSet.add(task.title);
      }
    }

    return roadmapData;
  } catch (e) {
    console.error("[Validation] JSON parsing failed after auto-fix:", e);
    return null;
  }
}

// Track used topics to prevent repetition
interface TopicTracker {
  usedTitles: Set<string>;
  usedTopics: Set<string>;
  currentLevel: string;
  progressionStages: {
    beginner: string[];
    intermediate: string[];
    advanced: string[];
    expert: string[];
  };
}

function initializeTopicTracker(): TopicTracker {
  return {
    usedTitles: new Set<string>(),
    usedTopics: new Set<string>(),
    currentLevel: "beginner",
    progressionStages: {
      beginner: [
        "Fundamentals",
        "Basic Concepts",
        "Introduction",
        "Getting Started",
      ],
      intermediate: [
        "Intermediate",
        "Applied Concepts",
        "Building Skills",
        "Practical Usage",
      ],
      advanced: [
        "Advanced",
        "Complex Topics",
        "Deep Dive",
        "Professional Skills",
      ],
      expert: ["Expert", "Mastery", "Specialized Topics", "Industry Level"],
    },
  };
}

function getProgressionLevel(weekNumber: number, totalWeeks: number): string {
  const progress = weekNumber / totalWeeks;
  if (progress <= 0.25) return "beginner";
  if (progress <= 0.5) return "intermediate";
  if (progress <= 0.75) return "advanced";
  return "expert";
}

// Helper function to generate a chunk of weeks with topic tracking
async function generateWeeksChunk(
  model: any,
  userGoals: UserGoals,
  startWeek: number,
  numWeeks: number,
  totalWeeks: number,
  topicTracker: TopicTracker,
): Promise<any> {
  const currentLevel = getProgressionLevel(startWeek, totalWeeks);
  topicTracker.currentLevel = currentLevel;

  const previousTopics =
    Array.from(topicTracker.usedTopics).slice(-5).join(", ") || "None yet";

  const prompt = `
Create a chunk of a learning roadmap for weeks ${startWeek} to ${startWeek + numWeeks - 1}. The roadmap is ${totalWeeks} weeks in total.
The learner is at a ${currentLevel.toUpperCase()} level for this chunk.
The most recent topics covered were: "${previousTopics}". Please create a logical progression from these. Do not repeat them.

User Goal: ${userGoals.goal}
Current Skills: ${userGoals.currentSkills.join(", ") || "None specified"}
Daily Commitment: ${userGoals.dailyCommitment}

STRICT INSTRUCTIONS:
- Generate exactly ${numWeeks} weeks of content, starting from week ${startWeek}.
- All week titles and daily task titles MUST be unique and not repeat previous topics.
- Tasks must be specific, actionable, and match the current ${currentLevel} difficulty.
- Provide 2-3 high-quality, up-to-date resources for each task.
- Your entire response must be ONLY a single, valid, complete JSON object.
- Do NOT include any comments, markdown, explanations, or anything outside the JSON structure.

JSON format:
{
  "weeks": [
    {
      "week": ${startWeek},
      "title": "Unique Week ${startWeek} Title (e.g., 'Advanced Data Cleaning Techniques')",
      "tasks": [
        {
          "id": "w${startWeek}d1",
          "day": 1,
          "title": "Unique and specific task title (e.g., 'Handling Outliers with Z-score')",
          "description": "A detailed description of the task.",
          "estimatedTime": "1-2 hours",
          "resources": ["https://resource1.com", "https://resource2.com"]
        }
      ]
    }
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log(
      `[RoadmapGen] AI response received for weeks ${startWeek}-${startWeek + numWeeks - 1}`,
    );

    // Clean and validate JSON for this chunk
    let jsonText = text
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    const startIndex = jsonText.indexOf("{");
    const endIndex = jsonText.lastIndexOf("}");

    if (startIndex === -1 || endIndex === -1) {
      throw new Error("No JSON object found in chunk response");
    }

    jsonText = jsonText.substring(startIndex, endIndex + 1);

    const chunkData = JSON.parse(jsonText);
    if (!chunkData || !Array.isArray(chunkData.weeks)) {
      throw new Error("Invalid chunk structure");
    }

    // Update topic tracker with new topics
    chunkData.weeks.forEach((week: any) => {
      topicTracker.usedTopics.add(week.title.toLowerCase());
      week.tasks.forEach((task: any) => {
        topicTracker.usedTitles.add(task.title.toLowerCase());
      });
    });

    return chunkData.weeks;
  } catch (error) {
    console.error(
      `[RoadmapGen] Error processing chunk response for weeks ${startWeek}-${startWeek + numWeeks - 1}:`,
      error,
    );
    throw error;
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateRoadmapWithAI = async (
  userGoals: UserGoals,
): Promise<Roadmap> => {
  try {
    // Check for cached roadmap first
    const cachedRoadmap = getCachedRoadmap(userGoals);
    if (cachedRoadmap) {
      console.log("[RoadmapGen] Using cached roadmap - no API call needed");
      return cachedRoadmap;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const totalWeeks = parseTimeframeToWeeks(userGoals.timeframe);
    console.log(
      `[RoadmapGen] Timeframe: ${userGoals.timeframe} → Weeks: ${totalWeeks}`,
    );

    // Initialize topic tracker
    const topicTracker = initializeTopicTracker();

    // Generate initial roadmap metadata
    const metadataPrompt = `
Create a title and description for a ${totalWeeks}-week learning roadmap with the following requirements:

Goal: ${userGoals.goal}
Current Skills: ${userGoals.currentSkills.join(", ") || "None specified"}

Return ONLY valid JSON in this format:
{
  "title": "Overall Roadmap Title",
  "description": "Brief description of the entire learning path"
}`;

    const metadataResult = await model.generateContent(metadataPrompt);
    const metadataText = (await metadataResult.response).text();
    const metadata = JSON.parse(
      metadataText
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim(),
    );

    // Generate weeks in chunks
    const CHUNK_SIZE = 4;
    const MAX_RETRIES = 2;
    const allWeeks = [];

    for (let startWeek = 1; startWeek <= totalWeeks; startWeek += CHUNK_SIZE) {
      const remainingWeeks = totalWeeks - startWeek + 1;
      const weeksInThisChunk = Math.min(CHUNK_SIZE, remainingWeeks);

      let retries = 0;
      let chunkSucceeded = false;
      while (retries < MAX_RETRIES && !chunkSucceeded) {
        try {
          console.log(
            `[RoadmapGen] Generating chunk for weeks ${startWeek}-${startWeek + weeksInThisChunk - 1} (Attempt ${retries + 1})`,
          );

          const weekChunk = await generateWeeksChunk(
            model,
            userGoals,
            startWeek,
            weeksInThisChunk,
            totalWeeks,
            topicTracker,
          );
          allWeeks.push(...weekChunk);
          chunkSucceeded = true;
        } catch (error) {
          retries++;
          console.error(
            `[RoadmapGen] Attempt ${retries} failed for chunk starting at week ${startWeek}:`,
            error,
          );
          if (retries < MAX_RETRIES) {
            const backoffTime = 1000 * 2 ** retries; // Exponential backoff: 2s, 4s
            console.log(`[RoadmapGen] Retrying in ${backoffTime / 1000}s...`);
            await delay(backoffTime);
          } else {
            console.error(
              `[RoadmapGen] All retries failed for chunk ${startWeek}. Using fallback.`,
            );
          }
        }
      }

      // If all retries failed, use the fallback for this chunk
      if (!chunkSucceeded) {
        const level = getProgressionLevel(startWeek, totalWeeks);
        for (
          let week = startWeek;
          week < startWeek + weeksInThisChunk;
          week++
        ) {
          const weekTitle = `${topicTracker.progressionStages[level][week % topicTracker.progressionStages[level].length]} - Week ${week}`;
          if (!topicTracker.usedTopics.has(weekTitle.toLowerCase())) {
            allWeeks.push({
              week,
              title: weekTitle,
              tasks: Array.from({ length: 5 }, (_, i) => {
                const taskTitle = `${level.charAt(0).toUpperCase() + level.slice(1)} Task ${i + 1} - Week ${week}`;
                topicTracker.usedTitles.add(taskTitle.toLowerCase());
                return {
                  id: `w${week}d${i + 1}`,
                  day: i + 1,
                  title: taskTitle,
                  description: `Continue your ${level} progress in ${userGoals.goal}`,
                  estimatedTime: "1 hour",
                  resources: [
                    "https://www.freecodecamp.org/",
                    "https://www.w3schools.com/",
                    "https://developer.mozilla.org/",
                  ],
                };
              }),
            });
            topicTracker.usedTopics.add(weekTitle.toLowerCase());
          }
        }
      }

      // Add a delay before the next chunk request to avoid rate limiting
      if (startWeek + CHUNK_SIZE <= totalWeeks) {
        await delay(1500); // 1.5-second delay between chunks
      }
    }

    // Flatten the nested structure into the flat task list
    const flatTasks: Task[] = allWeeks.flatMap((week: any) =>
      week.tasks.map((task: any) => ({
        ...task,
        id: task.id || `w${week.week}d${task.day}`,
        week: week.week,
        completed: false,
      })),
    );

    // Create the final roadmap object
    const roadmap: Roadmap = {
      id: `roadmap_${Date.now()}`,
      title: metadata.title,
      description: metadata.description,
      totalWeeks,
      tasks: flatTasks,
      progress: 0,
      createdAt: new Date(),
    };

    console.log(
      `[RoadmapGen] Successfully generated roadmap with ${roadmap.tasks.length} tasks across ${roadmap.totalWeeks} weeks.`,
    );

    // Cache the generated roadmap for future use
    cacheRoadmap(userGoals, roadmap);

    return roadmap;
  } catch (error) {
    console.error(
      "[RoadmapGen] Error in main generation, falling back to default roadmap:",
      error,
    );
    // Use the existing fallback code
    // Fallback: dynamically generate a progressive curriculum for the requested number of weeks
    const totalWeeks = parseTimeframeToWeeks(userGoals.timeframe);
    const fallbackTasks: Task[] = [];

    // Define curriculum stages
    const curriculumStages = [
      {
        name: "Foundations",
        topics: [
          {
            title: "Intro to HTML",
            desc: "Learn the structure and semantics of web pages using HTML.",
            resources: [
              "https://developer.mozilla.org/en-US/docs/Web/HTML",
              "https://www.youtube.com/watch?v=pQN-pnXPaVg",
            ],
          },
          {
            title: "Styling with CSS",
            desc: "Understand CSS syntax, selectors, and how to style HTML elements.",
            resources: [
              "https://developer.mozilla.org/en-US/docs/Web/CSS",
              "https://www.freecodecamp.org/learn/responsive-web-design/basic-css/",
            ],
          },
          {
            title: "CSS Flexbox & Grid",
            desc: "Create responsive layouts using Flexbox and CSS Grid.",
            resources: [
              "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
              "https://cssgridgarden.com/",
            ],
          },
          {
            title: "Accessibility Basics",
            desc: "Learn how to make web pages accessible to all users.",
            resources: [
              "https://www.w3.org/WAI/fundamentals/accessibility-intro/",
              "https://www.youtube.com/watch?v=3f31oufqFSM",
            ],
          },
        ],
      },
      {
        name: "Intermediate",
        topics: [
          {
            title: "JavaScript Syntax & Variables",
            desc: "Get started with JavaScript syntax, variables, and data types.",
            resources: [
              "https://javascript.info/",
              "https://www.youtube.com/watch?v=W6NZfCO5SIk",
            ],
          },
          {
            title: "Functions & Loops",
            desc: "Write reusable code using functions and control flow with loops.",
            resources: [
              "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions",
              "https://www.codecademy.com/learn/introduction-to-javascript",
            ],
          },
          {
            title: "DOM Manipulation",
            desc: "Learn how to interact with web pages using the DOM API.",
            resources: [
              "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction",
              "https://www.youtube.com/watch?v=0ik6X4DJKCc",
            ],
          },
          {
            title: "Events in JS",
            desc: "Handle user input and browser events in JavaScript.",
            resources: [
              "https://javascript.info/events",
              "https://www.youtube.com/watch?v=XF1_MlZ5l6M",
            ],
          },
        ],
      },
      {
        name: "Advanced",
        topics: [
          {
            title: "ES6+ Features",
            desc: "Explore modern JavaScript features like let/const, arrow functions, and modules.",
            resources: [
              "https://www.freecodecamp.org/news/es6-for-beginners/",
              "https://www.youtube.com/watch?v=NCwa_xi0Uuc",
            ],
          },
          {
            title: "NPM & Modules",
            desc: "Learn about npm, installing packages, and using JS modules.",
            resources: [
              "https://docs.npmjs.com/about-npm",
              "https://www.youtube.com/watch?v=jHDhaSSKmB0",
            ],
          },
          {
            title: "Debugging JS",
            desc: "Use browser dev tools and console to debug JavaScript code.",
            resources: [
              "https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_are_browser_developer_tools",
              "https://www.youtube.com/watch?v=H0XScE08hy8",
            ],
          },
          {
            title: "APIs & Fetch",
            desc: "Work with APIs using fetch to get and display data.",
            resources: [
              "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch",
              "https://www.youtube.com/watch?v=cuEtnrL9-H0",
            ],
          },
        ],
      },
      {
        name: "React & Frameworks",
        topics: [
          {
            title: "Intro to React",
            desc: "Understand React concepts and create your first component.",
            resources: [
              "https://react.dev/learn",
              "https://www.youtube.com/watch?v=bMknfKXIFA8",
            ],
          },
          {
            title: "JSX & Props",
            desc: "Learn JSX syntax and how to pass data with props.",
            resources: [
              "https://react.dev/learn/describing-the-ui",
              "https://www.youtube.com/watch?v=De-g4U0QZlI",
            ],
          },
          {
            title: "State & Events",
            desc: "Manage component state and handle user events in React.",
            resources: [
              "https://react.dev/learn/state-a-components-memory",
              "https://www.youtube.com/watch?v=35lXWvCuM8o",
            ],
          },
          {
            title: "Lists & Keys",
            desc: "Render lists of data and use keys in React.",
            resources: [
              "https://react.dev/learn/rendering-lists",
              "https://www.youtube.com/watch?v=c6bkr_udado",
            ],
          },
        ],
      },
      {
        name: "Projects & Review",
        topics: [
          {
            title: "Build: To-Do App",
            desc: "Create a simple to-do list app using React.",
            resources: [
              "https://www.youtube.com/watch?v=pCA4qpQDZD8",
              "https://www.freecodecamp.org/news/react-projects-for-beginners/",
            ],
          },
          {
            title: "Portfolio Website",
            desc: "Build and deploy a personal portfolio website using React.",
            resources: [
              "https://www.freecodecamp.org/news/portfolio-website-guide/",
              "https://www.youtube.com/watch?v=CK4gq9Fh2gA",
            ],
          },
          {
            title: "Testing & Debugging Advanced Apps",
            desc: "Learn advanced testing strategies for React apps, including unit, integration, and end-to-end testing.",
            resources: [
              "https://testing-library.com/docs/react-testing-library/intro/",
              "https://www.cypress.io/",
              "https://www.youtube.com/watch?v=JKOwJUM4_RM",
            ],
          },
          {
            title: "Performance Optimization",
            desc: "Optimize your app for speed and efficiency. Learn about code splitting, lazy loading, and performance profiling.",
            resources: [
              "https://react.dev/learn/optimizing-performance",
              "https://web.dev/fast/",
              "https://www.youtube.com/watch?v=CUxH_rWSI1k",
            ],
          },
          {
            title: "Deployment & Hosting",
            desc: "Deploy your frontend app to a cloud platform. Learn about Vercel, Netlify, and best practices for production deployments.",
            resources: [
              "https://vercel.com/docs",
              "https://www.netlify.com/with/react/",
              "https://www.youtube.com/watch?v=nhBVL41-_Cw",
            ],
          },
          {
            title: "Showcase & Review",
            desc: "Prepare a demo, write documentation, and review your project. Share your work with others for feedback.",
            resources: [
              "https://dev.to/",
              "https://github.com/",
              "https://www.youtube.com/watch?v=2Ji-clqUYnA",
            ],
          },
        ],
      },
    ];

    // Helper: default breakdowns for topics
    const topicBreakdowns: Record<string, string[]> = {
      "Intro to HTML": [
        "Learn the structure and basic tags of HTML.",
        "Build a simple web page using HTML.",
        "Explore semantic HTML elements and their uses.",
        "Accessibility and best practices in HTML.",
      ],
      "Styling with CSS": [
        "Understand CSS syntax, selectors, and properties.",
        "Apply CSS to style a basic web page.",
        "Responsive design: media queries and units.",
        "CSS best practices and organization.",
      ],
      "CSS Flexbox & Grid": [
        "Learn Flexbox layout and alignment.",
        "Practice building layouts with Flexbox.",
        "Learn CSS Grid layout and areas.",
        "Build a responsive layout using Grid and Flexbox.",
      ],
      "Accessibility Basics": [
        "Introduction to web accessibility.",
        "Using ARIA roles and attributes.",
        "Keyboard navigation and focus management.",
        "Testing and improving accessibility.",
      ],
      "JavaScript Syntax & Variables": [
        "JavaScript syntax, variables, and data types.",
        "Operators and expressions in JavaScript.",
        "Type conversion and coercion.",
        "Best practices for variable usage.",
      ],
      "Functions & Loops": [
        "Defining and calling functions.",
        "Function parameters and return values.",
        "Loops: for, while, and do-while.",
        "Combining functions and loops in practice.",
      ],
      "DOM Manipulation": [
        "Selecting and modifying DOM elements.",
        "Creating and removing elements dynamically.",
        "Event listeners and DOM events.",
        "Practical DOM manipulation project.",
      ],
      "Events in JS": [
        "Understanding browser events.",
        "Handling user input events.",
        "Event delegation and bubbling.",
        "Building an interactive feature with events.",
      ],
      "ES6+ Features": [
        "let/const, arrow functions, and template literals.",
        "Destructuring and spread/rest operators.",
        "Modules and imports/exports.",
        "Practice ES6+ features in a mini-project.",
      ],
      "NPM & Modules": [
        "What is npm and how to use it.",
        "Installing and managing packages.",
        "Using JavaScript modules.",
        "Building a project with npm scripts.",
      ],
      "Debugging JS": [
        "Using browser dev tools for debugging.",
        "Console logging and breakpoints.",
        "Common JavaScript errors and fixes.",
        "Debugging a sample project.",
      ],
      "APIs & Fetch": [
        "What are APIs and how to use them.",
        "Making GET requests with fetch().",
        "Handling API responses and errors.",
        "Build a small app that uses an API.",
      ],
      "Intro to React": [
        "What is React and why use it?",
        "Creating your first React component.",
        "JSX syntax and rendering elements.",
        "React project: simple component tree.",
      ],
      "JSX & Props": [
        "JSX syntax and expressions.",
        "Passing props to components.",
        "Prop types and default props.",
        "Practice: reusable component with props.",
      ],
      "State & Events": [
        "useState hook and state basics.",
        "Updating state and re-rendering.",
        "Handling user events in React.",
        "Build a stateful interactive component.",
      ],
      "Lists & Keys": [
        "Rendering lists in React.",
        "Using keys for list items.",
        "Mapping data to components.",
        "Project: dynamic list rendering.",
      ],
      "Build: To-Do App": [
        "Plan the to-do app structure.",
        "Build the UI for the to-do app.",
        "Add interactivity and state management.",
        "Test and deploy the to-do app.",
      ],
      "Portfolio Website": [
        "Design your portfolio layout.",
        "Build the homepage and about section.",
        "Add projects and contact form.",
        "Deploy and share your portfolio.",
      ],
      "Testing & Debugging Advanced Apps": [
        "Unit testing in React.",
        "Integration testing strategies.",
        "End-to-end testing overview.",
        "Debugging complex React apps.",
      ],
      "Performance Optimization": [
        "Profiling React apps.",
        "Code splitting and lazy loading.",
        "Optimizing rendering and state.",
        "Performance best practices.",
      ],
      "Deployment & Hosting": [
        "Overview of deployment options.",
        "Deploying to Vercel/Netlify.",
        "Environment variables and configs.",
        "Best practices for production.",
      ],
      "Showcase & Review": [
        "Preparing a project demo.",
        "Writing documentation.",
        "Getting feedback and iterating.",
        "Showcasing your work online.",
      ],
    };

    // Distribute weeks across stages
    const stagesCount = curriculumStages.length;
    const weeksPerStage = Math.floor(totalWeeks / stagesCount);
    let extraWeeks = totalWeeks % stagesCount;
    let weekNumber = 1;
    for (let i = 0; i < stagesCount; i++) {
      let weeksThisStage = weeksPerStage + (extraWeeks > 0 ? 1 : 0);
      if (extraWeeks > 0) extraWeeks--;
      const topics = curriculumStages[i].topics;
      // Assign each topic to a unique week first
      for (let t = 0; t < Math.min(weeksThisStage, topics.length); t++) {
        const topic = topics[t];
        const breakdown = topicBreakdowns[topic.title] || [
          `Introduction to ${topic.title}.`,
          `Hands-on practice with ${topic.title}.`,
          `Deep dive into advanced aspects of ${topic.title}.`,
          `Review and mini-project for ${topic.title}.`,
        ];
        for (let day = 1; day <= 4; day++) {
          fallbackTasks.push({
            id: `w${weekNumber}d${day}`,
            title: `${topic.title} - Day ${day}`,
            description: breakdown[day - 1],
            completed: false,
            day,
            week: weekNumber,
            estimatedTime: "1 hour",
            resources: topic.resources,
          });
        }
        weekNumber++;
      }
      // If more weeks than topics, fill with review/project weeks
      for (let w = topics.length; w < weeksThisStage; w++) {
        for (let day = 1; day <= 4; day++) {
          fallbackTasks.push({
            id: `w${weekNumber}d${day}`,
            title: `${curriculumStages[i].name} Review & Project (Week ${weekNumber}) - Day ${day}`,
            description: `Apply, review, and extend your knowledge from the ${curriculumStages[i].name} stage. Build a mini-project or complete a comprehensive review of all topics learned so far in this stage.`,
            completed: false,
            day,
            week: weekNumber,
            estimatedTime: "1 hour",
            resources: [
              "https://www.frontendmentor.io/challenges",
              "https://www.freecodecamp.org/",
              "https://www.youtube.com/results?search_query=project+review+practice",
            ],
          });
        }
        weekNumber++;
      }
    }
    return {
      id: `roadmap_${Date.now()}`,
      title: `${userGoals.goal} Learning Path`,
      description: `A personalized learning roadmap to achieve your goal of ${userGoals.goal}`,
      totalWeeks,
      tasks: fallbackTasks,
      createdAt: new Date(),
      progress: 0,
    };
  }
};
