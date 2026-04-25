import api from '@/lib/axios'
import type {
  ApiResponse,
  TokenResponse,
  User,
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  ProfileUpdateFormData,
} from '@/types'

export const authService = {
  login: (data: LoginFormData) =>
    api.post<ApiResponse<TokenResponse>>('/api/auth/login', data),

  register: (data: RegisterFormData) =>
    api.post<ApiResponse<TokenResponse>>('/api/auth/register', data),

  forgotPassword: (data: ForgotPasswordFormData) =>
    api.post<ApiResponse<null>>('/api/auth/forgot-password', data),

  resetPassword: (data: Omit<ResetPasswordFormData, 'confirm_password'>) =>
    api.post<ApiResponse<null>>('/api/auth/reset-password', data),
}

export const userService = {
  getProfile: () =>
    api.get<ApiResponse<User>>('/api/user/profile'),

  updateProfile: (data: ProfileUpdateFormData) =>
    api.put<ApiResponse<User>>('/api/user/profile', data),
}
