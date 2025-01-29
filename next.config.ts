/* eslint-disable @typescript-eslint/no-require-imports */
import type { NextConfig } from "next";
require('dotenv').config('.env');

const nextConfig: NextConfig = {
  env:{
    API_KEY: process.env.API_KEY
  }
};

export default nextConfig;
