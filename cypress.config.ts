/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineConfig } from "cypress";
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    env: {
      NEXT_PUBLIC_API_ADDRESS: process.env.NEXT_PUBLIC_API_ADDRESS
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
