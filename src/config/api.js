// API Configuration
// Import from constants for consistency
import { API_BASE_URL as CONSTANTS_API_BASE_URL } from '../utils/constants';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || CONSTANTS_API_BASE_URL;

// You can set this in .env file:
// VITE_API_BASE_URL=https://learnarabic.iwings-digital.com
