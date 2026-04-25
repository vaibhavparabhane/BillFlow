'use client'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { TextField, Button, Box, Link as MuiLink, Stack } from '@mui/material'
import LoadingButton from '@/components/common/LoadingButton'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useSnackbar } from 'notistack'
import AuthCard from '@/components/common/AuthCard'
import PasswordField from '@/components/forms/PasswordField'
import { authService } from '@/services/api'
import { getApiError } from '@/hooks/useApiError'
import { ROUTES, VALIDATION } from '@/lib/constants'
import type { ResetPasswordFormData } from '@/types'

const schema = yup.object({
  email: yup.string().required('Email is required').email('Invalid email'),
  otp_code: yup
    .string()
    .required('OTP is required')
    .length(VALIDATION.OTP_LENGTH, `OTP must be ${VALIDATION.OTP_LENGTH} digits`)
    .matches(/^[0-9]+$/, 'OTP must be numeric'),
  new_password: yup
    .string()
    .required('Password is required')
    .min(VALIDATION.PASSWORD_MIN, `Min ${VALIDATION.PASSWORD_MIN} characters`)
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/[a-z]/, 'Must contain a lowercase letter')
    .matches(/[0-9]/, 'Must contain a digit')
    .matches(/[!@#$%^&*()_+\-=\[\]{}|;':",./<>?]/, 'Must contain a special character'),
  confirm_password: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('new_password')], 'Passwords do not match'),
})

export default function ResetPasswordPage() {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({ resolver: yupResolver(schema) })

  const onSubmit = async ({ confirm_password, ...data }: ResetPasswordFormData) => {
    try {
      const res = await authService.resetPassword(data)
      enqueueSnackbar(res.data.message ?? 'Password reset successful!', { variant: 'success' })
      router.replace(ROUTES.LOGIN)
    } catch (err) {
      enqueueSnackbar(getApiError(err), { variant: 'error' })
    }
  }

  return (
    <AuthCard title="Reset password" subtitle="Enter the OTP sent to your email.">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>
          <TextField
            label="Email"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            autoFocus
          />
          <TextField
            label="OTP"
            {...register('otp_code')}
            error={!!errors.otp_code}
            helperText={errors.otp_code?.message}
            inputProps={{ maxLength: VALIDATION.OTP_LENGTH, inputMode: 'numeric' }}
          />
          <PasswordField
            label="New Password"
            {...register('new_password')}
            error={!!errors.new_password}
            helperText={errors.new_password?.message}
            autoComplete="new-password"
          />
          <PasswordField
            label="Confirm Password"
            {...register('confirm_password')}
            error={!!errors.confirm_password}
            helperText={errors.confirm_password?.message}
            autoComplete="new-password"
          />
          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            loading={isSubmitting}
          >
            Reset Password
          </LoadingButton>
          <Box sx={{ textAlign: 'center' }}>
            <MuiLink component={NextLink} href={ROUTES.LOGIN} variant="body2">
              Back to sign in
            </MuiLink>
          </Box>
        </Stack>
      </Box>
    </AuthCard>
  )
}
