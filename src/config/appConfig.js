export const appConfig = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  },
  runpod: {
    faceswapUrl: import.meta.env.VITE_RUNPOD_FACESWAP_URL || "",
    apiKey: import.meta.env.VITE_RUNPOD_API_KEY || "",
  },
  buckets: {
    images: "phonepe_images",
    characters: "pwc_character_images",
  },
  tables: {
    images: "event_output_images",
    users: "PWC photo Booth 27th Jan",
  },
  tagOptions: ["Learner", "Program Team", "Facilitator", "Leader", "Speaker"],
  polling: {
    maxAttempts: 60,
    interval: 3000, // 3 seconds
  },
};
