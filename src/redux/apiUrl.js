// ✅ Use VITE_API_BASE_URL env var if available, otherwise fallback to relative /api for local proxy/Vercel rewrite
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const API_BASE_URL = BASE_URL;
