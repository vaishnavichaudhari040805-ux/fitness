import { config } from "../config/env";
import { AppError } from "../middlewares/errorHandler";
import { HttpStatus } from "../utils/apiResponse";
import prisma from "../config/database";

// ─── Types ─────────────────────────────────────────────────────
interface WorkoutDay {
  day: string;
  title: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weightKg: number | null;
    restSeconds: number;
    notes: string;
  }[];
}

interface WeekPlan {
  week: number;
  focus: string;
  days: WorkoutDay[];
}

interface AiWorkoutPlan {
  planTitle: string;
  planDescription: string;
  weeklyPlan: WeekPlan[];
  generalTips: string[];
}

// ─── Build AI Prompt from User Profile ────────────────────────
const buildWorkoutPrompt = (profile: any): string => {
  const heightM = profile.heightCm / 100;
  const bmi = (profile.weightKg / (heightM * heightM)).toFixed(2);

  return `
You are an expert certified personal trainer and nutritionist.
Generate a detailed, personalized 4-week workout plan for the following user.

USER PROFILE:
- Name: ${profile.firstName} ${profile.lastName}
- Age: ${profile.age} years
- Weight: ${profile.weightKg} kg
- Height: ${profile.heightCm} cm
- BMI: ${bmi}
- Fitness Goal: ${profile.goal}
- Activity Level: ${profile.activityLevel}

INSTRUCTIONS:
1. Create a 4-week progressive workout plan
2. Each week should have 4-5 workout days with rest days
3. Progressively increase intensity each week
4. Tailor exercises specifically to the user's goal: ${profile.goal}
5. Keep BMI of ${bmi} in mind when selecting exercise intensity

RESPONSE FORMAT:
You must respond with ONLY a valid JSON object. No extra text.
Use this exact structure:
{
  "planTitle": "string",
  "planDescription": "string",
  "weeklyPlan": [
    {
      "week": 1,
      "focus": "string",
      "days": [
        {
          "day": "Monday",
          "title": "string",
          "exercises": [
            {
              "name": "string",
              "sets": 3,
              "reps": 12,
              "weightKg": null,
              "restSeconds": 60,
              "notes": "string"
            }
          ]
        }
      ]
    }
  ],
  "generalTips": ["string", "string", "string"]
}
`;
};

// ─── Call Gemini API ───────────────────────────────────────────
const callGeminiAPI = async (prompt: string): Promise<AiWorkoutPlan> => {
  if (!config.ai.geminiApiKey) {
    throw new AppError(
      "AI service is not configured. Please add GEMINI_API_KEY to .env",
      HttpStatus.INTERNAL_SERVER
    );
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${config.ai.geminiApiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new AppError(
      "Failed to get response from AI service.",
      HttpStatus.INTERNAL_SERVER
    );
  }

  const data = await response.json();

  // ─── Extract text from Gemini response ─────────────────────
  const rawText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  if (!rawText) {
    throw new AppError(
      "AI returned an empty response.",
      HttpStatus.INTERNAL_SERVER
    );
  }

  // ─── Clean and parse JSON ───────────────────────────────────
  const cleanedText = rawText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    const parsed: AiWorkoutPlan = JSON.parse(cleanedText);
    return parsed;
  } catch {
    throw new AppError(
      "AI returned invalid JSON. Please try again.",
      HttpStatus.INTERNAL_SERVER
    );
  }
};

// ─── Generate AI Workout Plan Service ─────────────────────────
export const generateAiWorkoutService = async (userId: string) => {
  // ─── Fetch user profile ─────────────────────────────────────
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError(
      "Please create your profile before generating an AI workout plan.",
      HttpStatus.NOT_FOUND
    );
  }

  // ─── Build prompt and call AI ───────────────────────────────
  const prompt = buildWorkoutPrompt(profile);
  const aiPlan = await callGeminiAPI(prompt);

  // ─── Save Week 1 workouts to database ──────────────────────
  const week1 = aiPlan.weeklyPlan[0];

  if (week1 && week1.days.length > 0) {
    const workoutsToCreate = week1.days.map((day, index) => ({
      userId,
      title: `[AI] ${day.title}`,
      isAiGenerated: true,
      scheduledFor: new Date(
        Date.now() + index * 24 * 60 * 60 * 1000
      ),
      exercises: {
        create: day.exercises.map((ex) => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weightKg: ex.weightKg,
        })),
      },
    }));

    // ─── Create all week 1 workouts in DB ──────────────────
    await Promise.all(
      workoutsToCreate.map((workout) =>
        prisma.workout.create({
          data: workout,
          include: { exercises: true },
        })
      )
    );
  }

  return aiPlan;
};