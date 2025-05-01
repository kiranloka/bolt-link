import { authMiddleware } from "@clerk/express";
export const auth = authMiddleware({ apiKey: process.env.CLERK_API_KEY });
