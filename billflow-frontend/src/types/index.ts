export interface User {
  id: string
  name: string
  email: string
  business_name: string
  gstin: string | null
  address: string | null
  phone: string | null
  is_active: boolean
  is_email_verified: boolean
  last_login: string | null
  created_at: string
  updated_at: string
}

export interface TokenResponse {
  token: string
  user: User
}

export interface ApiResponse<T = null> {
  success: boolean
  message: string
  data: T
}

// Auth forms
export interface LoginFormData {
  identifier: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  business_name: string
  gstin?: string
  phone?: string
}

export interface ForgotPasswordFormData {
  email: string
}

export interface ResetPasswordFormData {
  email: string
  otp_code: string
  new_password: string
  confirm_password: string
}

export interface ProfileUpdateFormData {
  business_name: string
  gstin?: string
  address?: string
  phone?: string
}
