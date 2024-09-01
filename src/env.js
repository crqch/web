import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    DATABASE_URL: z.string().url(),
    REGISTER_KEY: z.string()
  },

 
  client: {
   
  },


  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    REGISTER_KEY: process.env.REGISTER_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
 
  emptyStringAsUndefined: true,
});
