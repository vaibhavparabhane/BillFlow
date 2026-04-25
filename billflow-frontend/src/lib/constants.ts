export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
} as const

export const VALIDATION = {
  NAME_MIN: 2,
  NAME_MAX: 100,
  BUSINESS_NAME_MIN: 2,
  BUSINESS_NAME_MAX: 255,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,
  OTP_LENGTH: 6,
  GSTIN_PATTERN: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  PHONE_PATTERN: /^(?:\+91|0)?[6-9][0-9]{9}$/,
} as const

export const STORAGE_KEY = 'auth'

export const DRAWER_WIDTH = 240
