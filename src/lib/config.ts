// ============================================
// EDYFRA CONFIGURATION - All Hardcoded Values
// ============================================

// Session & Points Configuration
export const SESSION_CONFIG = {
  POINTS_STUDENT: 50,
  POINTS_TUTOR: 100,
  DAILY_ACTIVITY_REWARD: 100,
  NEW_USER_WELCOME_BONUS: 500,
  CHALLENGE_ATTEMPT_LIMIT: 3,
  CHALLENGE_EASY_POINTS: 25,
  CHALLENGE_MEDIUM_POINTS: 50,
  CHALLENGE_HARD_POINTS: 100,
  SESSION_MATCH_TIMEOUT_MS: 60 * 1000, // 60 seconds
  MAX_MESSAGE_RATE_PER_MINUTE: 20,
  SESSION_MAX_DURATION_MIN: 60, // Auto-end after 60 minutes
};

// Tutor Configuration
export const TUTOR_CONFIG = {
  DEFAULT_HOURLY_RATE_KSH: 500,
  DEFAULT_BIO: "Professional Academic Mentor",
  VERIFICATION_REQUIRED: false,
  RATING_CALCULATION_MIN_REVIEWS: 3,
};

// Tier Configuration
const TIER_DEFS = [
  { minPoints: 1500, maxPoints: Infinity, name: "GOLD" },
  { minPoints: 500, maxPoints: 1499, name: "SILVER" },
  { minPoints: 0, maxPoints: 499, name: "BRONZE" },
];

export const TIER_CONFIG = {
  BRONZE: TIER_DEFS[2],
  SILVER: TIER_DEFS[1],
  GOLD: TIER_DEFS[0],
  getTierFromPoints: (points: number): string => {
    return TIER_DEFS.find(t => points >= t.minPoints)?.name || "BRONZE";
  },
};

// Admin Configuration
export const ADMIN_CONFIG = {
  SECRET_KEY: process.env.ADMIN_SECRET_KEY, // Avoid hardcoded fallback in production
  REQUIRE_VERIFICATION: true,
};

// Challenge Configuration
export const CHALLENGE_CONFIG = {
  DEFAULT_SUBJECT: "Mathematics",
  DIFFICULTY_LEVELS: ["EASY", "MEDIUM", "HARD"] as const,
  SEED_SUBJECTS: [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Kiswahili",
    "Geography",
    "History",
  ],
};

// Validation
export const VALIDATION = {
  MAX_BIO_LENGTH: 500,
  MIN_RATE_KSH: 100,
  MAX_RATE_KSH: 5000,
};
