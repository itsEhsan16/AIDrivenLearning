import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Roadmap, UserGoals } from "@/pages/Learning";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Cache utilities for roadmap persistence
const CACHE_KEY_PREFIX = "ai-learning-roadmap-";

/**
 * Generate a cache key based on user goals
 * This ensures the same goals retrieves the same cached roadmap
 */
export function generateCacheKey(userGoals: UserGoals): string {
  const goalsHash = JSON.stringify({
    goal: userGoals.goal.toLowerCase().trim(),
    currentSkills: userGoals.currentSkills
      .sort()
      .join(",")
      .toLowerCase()
      .trim(),
    timeframe: userGoals.timeframe.toLowerCase().trim(),
    dailyCommitment: userGoals.dailyCommitment.toLowerCase().trim(),
    learningStyle: userGoals.learningStyle
      .sort()
      .join(",")
      .toLowerCase()
      .trim(),
  });
  // Simple hash function for the goals string
  let hash = 0;
  for (let i = 0; i < goalsHash.length; i++) {
    const char = goalsHash.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `${CACHE_KEY_PREFIX}${Math.abs(hash)}`;
}

/**
 * Save a roadmap to browser cache (localStorage)
 */
export function cacheRoadmap(userGoals: UserGoals, roadmap: Roadmap): void {
  try {
    const cacheKey = generateCacheKey(userGoals);
    const cacheData = {
      roadmap,
      userGoals,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log(`[Cache] Roadmap saved with key: ${cacheKey}`);
  } catch (error) {
    console.warn("[Cache] Failed to cache roadmap:", error);
  }
}

/**
 * Retrieve a cached roadmap from browser cache
 */
export function getCachedRoadmap(userGoals: UserGoals): Roadmap | null {
  try {
    const cacheKey = generateCacheKey(userGoals);
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const cacheData = JSON.parse(cached);
      console.log(`[Cache] Roadmap retrieved with key: ${cacheKey}`);
      return cacheData.roadmap;
    }
  } catch (error) {
    console.warn("[Cache] Failed to retrieve cached roadmap:", error);
  }
  return null;
}

/**
 * Clear a specific cached roadmap
 */
export function clearRoadmapCache(userGoals: UserGoals): void {
  try {
    const cacheKey = generateCacheKey(userGoals);
    localStorage.removeItem(cacheKey);
    console.log(`[Cache] Roadmap cache cleared for key: ${cacheKey}`);
  } catch (error) {
    console.warn("[Cache] Failed to clear roadmap cache:", error);
  }
}

/**
 * Clear all cached roadmaps
 */
export function clearAllRoadmapCache(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    console.log(
      `[Cache] All roadmap caches cleared (${keysToRemove.length} entries)`,
    );
  } catch (error) {
    console.warn("[Cache] Failed to clear all roadmap caches:", error);
  }
}
