'use client'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { TextField, Box, Link as MuiLink, Stack } from '@mui/material'
import LoadingButton from '@/components/common/LoadingButton'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useSnackbar } from 'notistack'
import AuthCard from '@/components/common/AuthCard'
import PasswordField from '@/components/forms/PasswordField'
import { authService } from '@/services/api'
import { useAuthStore } from '@/store/auth.store'
import { getApiError } from '@/hooks/useApiError'
import { ROUTES, VALIDATION } from '@/lib/constants'
import type { LoginFormData } from '@/types'

const schema = yup.object({
  identifier: yup
    .string()
    .required('Email or phone is required')
    .min(VALIDATION.NAME_MIN, 'Too short'),
  password: yup
    .string()
    .required('Password is required')
    .min(VALIDATION.PASSWORD_MIN, `Min ${VALIDATION.PASSWORD_MIN} characters`),
})

export default function LoginPage() {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const setAuth = useAuthStore((s) => s.setAuth)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: yupResolver(schema) })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await authService.login(data)
      const { token, user } = res.data.data
      setAuth(user, token)
      router.replace(ROUTES.DASHBOARD)
    } catch (err) {
      enqueueSnackbar(getApiError(err), { variant: 'error' })
    }
  }

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your BillOps account">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>
          <TextField
            label="Email or Phone"
            {...register('identifier')}
            error={!!errors.identifier}
            helperText={errors.identifier?.message}
            autoComplete="username"
            autoFocus
          />
          <PasswordField
            label="Password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            autoComplete="current-password"
          />
          <Box sx={{ textAlign: 'right', mt: -1 }}>
            <MuiLink component={NextLink} href={ROUTES.FORGOT_PASSWORD} variant="body2">
              Forgot password?
            </MuiLink>
          </Box>
          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            loading={isSubmitting}
          >
            Sign In
          </LoadingButton>
          <Box sx={{ textAlign: 'center' }}>
            <MuiLink component={NextLink} href={ROUTES.REGISTER} variant="body2">
              Don&apos;t have an account? Sign up
            </MuiLink>
          </Box>
        </Stack>
      </Box>
    </AuthCard>
  )
}
