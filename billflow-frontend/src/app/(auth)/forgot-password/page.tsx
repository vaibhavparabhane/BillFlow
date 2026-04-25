'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { TextField, Button, Box, Link as MuiLink, Stack, Alert } from '@mui/material'
import LoadingButton from '@/components/common/LoadingButton'
import NextLink from 'next/link'
import { useSnackbar } from 'notistack'
import AuthCard from '@/components/common/AuthCard'
import { authService } from '@/services/api'
import { getApiError } from '@/hooks/useApiError'
import { ROUTES } from '@/lib/constants'
import type { ForgotPasswordFormData } from '@/types'

const schema = yup.object({
  email: yup.string().required('Email is required').email('Invalid email'),
})

export default function ForgotPasswordPage() {
  const { enqueueSnackbar } = useSnackbar()
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({ resolver: yupResolver(schema) })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await authService.forgotPassword(data)
      setSent(true)
    } catch (err) {
      enqueueSnackbar(getApiError(err), { variant: 'error' })
    }
  }

  return (
    <AuthCard
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset OTP."
    >
      {sent ? (
        <Stack spacing={2}>
          <Alert severity="success">
            OTP sent! Check your email and proceed to reset your password.
          </Alert>
          <Button
            component={NextLink}
            href={ROUTES.RESET_PASSWORD}
            variant="contained"
            fullWidth
          >
            Enter OTP
          </Button>
        </Stack>
      ) : (
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
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              loading={isSubmitting}
            >
              Send OTP
            </LoadingButton>
            <Box sx={{ textAlign: 'center' }}>
              <MuiLink component={NextLink} href={ROUTES.LOGIN} variant="body2">
                Back to sign in
              </MuiLink>
            </Box>
          </Stack>
        </Box>
      )}
    </AuthCard>
  )
}
