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
import type { RegisterFormData } from '@/types'

const schema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(VALIDATION.NAME_MIN, `Min ${VALIDATION.NAME_MIN} characters`)
    .max(VALIDATION.NAME_MAX),
  email: yup.string().required('Email is required').email('Invalid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(VALIDATION.PASSWORD_MIN, `Min ${VALIDATION.PASSWORD_MIN} characters`)
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/[a-z]/, 'Must contain a lowercase letter')
    .matches(/[0-9]/, 'Must contain a digit')
    .matches(/[!@#$%^&*()_+\-=\[\]{}|;':",./<>?]/, 'Must contain a special character'),
  business_name: yup
    .string()
    .required('Business name is required')
    .min(VALIDATION.BUSINESS_NAME_MIN, `Min ${VALIDATION.BUSINESS_NAME_MIN} characters`),
  gstin: yup
    .string()
    .optional()
    .test('gstin', 'Invalid GSTIN format', (v) => !v || VALIDATION.GSTIN_PATTERN.test(v)),
  phone: yup
    .string()
    .optional()
    .test('phone', 'Invalid Indian phone number', (v) => !v || VALIDATION.PHONE_PATTERN.test(v)),
})

export default function RegisterPage() {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const setAuth = useAuthStore((s) => s.setAuth)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: yupResolver(schema) })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const payload = {
        ...data,
        gstin: data.gstin || undefined,
        phone: data.phone || undefined,
      }
      const res = await authService.register(payload)
      const { token, user } = res.data.data
      setAuth(user, token)
      enqueueSnackbar('Account created successfully!', { variant: 'success' })
      router.replace(ROUTES.DASHBOARD)
    } catch (err) {
      enqueueSnackbar(getApiError(err), { variant: 'error' })
    }
  }

  return (
    <AuthCard title="Create your account" subtitle="Start managing your business with BillOps">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>
          <TextField
            label="Full Name"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            autoFocus
          />
          <TextField
            label="Email"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            autoComplete="email"
          />
          <PasswordField
            label="Password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            autoComplete="new-password"
          />
          <TextField
            label="Business Name"
            {...register('business_name')}
            error={!!errors.business_name}
            helperText={errors.business_name?.message}
          />
          <TextField
            label="GSTIN (optional)"
            {...register('gstin')}
            error={!!errors.gstin}
            helperText={errors.gstin?.message ?? 'e.g. 22AAAAA0000A1Z5'}
            inputProps={{ style: { textTransform: 'uppercase' } }}
          />
          <TextField
            label="Phone (optional)"
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            loading={isSubmitting}
          >
            Create Account
          </LoadingButton>
          <Box sx={{ textAlign: 'center' }}>
            <MuiLink component={NextLink} href={ROUTES.LOGIN} variant="body2">
              Already have an account? Sign in
            </MuiLink>
          </Box>
        </Stack>
      </Box>
    </AuthCard>
  )
}
