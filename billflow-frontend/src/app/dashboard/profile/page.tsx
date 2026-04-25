'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  Avatar,
  Skeleton,
  Divider,
  Stack,
  Chip,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { useSnackbar } from 'notistack'
import { userService } from '@/services/api'
import { useAuthStore } from '@/store/auth.store'
import { getApiError } from '@/hooks/useApiError'
import { VALIDATION } from '@/lib/constants'
import LoadingButton from '@/components/common/LoadingButton'
import type { ProfileUpdateFormData } from '@/types'

const schema = yup.object({
  business_name: yup
    .string()
    .required('Business name is required')
    .min(VALIDATION.BUSINESS_NAME_MIN)
    .max(VALIDATION.BUSINESS_NAME_MAX),
  gstin: yup
    .string()
    .optional()
    .test('gstin', 'Invalid GSTIN format', (v) => !v || VALIDATION.GSTIN_PATTERN.test(v)),
  address: yup.string().optional(),
  phone: yup
    .string()
    .optional()
    .test('phone', 'Invalid Indian phone number', (v) => !v || VALIDATION.PHONE_PATTERN.test(v)),
})

export default function ProfilePage() {
  const { enqueueSnackbar } = useSnackbar()
  const { user, setUser } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileUpdateFormData>({ resolver: yupResolver(schema) })

  useEffect(() => {
    userService
      .getProfile()
      .then((res) => {
        const u = res.data.data
        setUser(u)
        reset({
          business_name: u.business_name ?? '',
          gstin: u.gstin ?? '',
          address: u.address ?? '',
          phone: u.phone ?? '',
        })
      })
      .catch((err) => enqueueSnackbar(getApiError(err), { variant: 'error' }))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data: ProfileUpdateFormData) => {
    try {
      const payload = {
        ...data,
        gstin: data.gstin || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
      }
      const res = await userService.updateProfile(payload)
      setUser(res.data.data)
      enqueueSnackbar('Profile updated successfully!', { variant: 'success' })
      reset(data)
    } catch (err) {
      enqueueSnackbar(getApiError(err), { variant: 'error' })
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setLogoPreview(reader.result as string)
    reader.readAsDataURL(file)
    // reset so same file can be picked again
    e.target.value = ''
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Profile
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage your account and business details
      </Typography>

      <Grid container spacing={3}>
        {/* Identity card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              {loading ? (
                <>
                  <Skeleton variant="circular" width={80} height={80} sx={{ mx: 'auto', mb: 2 }} />
                  <Skeleton width="60%" sx={{ mx: 'auto' }} />
                  <Skeleton width="40%" sx={{ mx: 'auto', mt: 1 }} />
                </>
              ) : (
                <>
                  <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                    <Avatar
                      src={logoPreview ?? undefined}
                      sx={{ width: 80, height: 80, fontSize: 28, bgcolor: 'primary.main', mx: 'auto' }}
                    >
                      {initials}
                    </Avatar>
                    <Box
                      onClick={() => fileInputRef.current?.click()}
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'background.paper',
                        border: '2px solid',
                        borderColor: 'divider',
                        borderRadius: '50%',
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <EditIcon sx={{ fontSize: 14 }} />
                    </Box>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleLogoChange}
                    />
                  </Box>
                  <Typography variant="h6">{user?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                    {user?.is_email_verified && (
                      <Chip label="Verified" color="success" size="small" />
                    )}
                    {user?.is_active && (
                      <Chip label="Active" color="primary" size="small" variant="outlined" />
                    )}
                  </Stack>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Edit form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Business Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              {loading ? (
                <Stack spacing={2.5}>
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={56} />
                  ))}
                </Stack>
              ) : (
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <Stack spacing={2.5}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Full Name"
                          value={user?.name ?? ''}
                          disabled
                          helperText="Contact support to change your name"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Email"
                          value={user?.email ?? ''}
                          disabled
                        />
                      </Grid>
                    </Grid>
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
                    <TextField
                      label="Address (optional)"
                      {...register('address')}
                      error={!!errors.address}
                      helperText={errors.address?.message}
                      multiline
                      rows={3}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        disabled={!isDirty}
                        sx={{ minWidth: 140 }}
                      >
                        Save Changes
                      </LoadingButton>
                    </Box>
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
