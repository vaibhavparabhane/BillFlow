'use client'

import { Grid, Card, CardContent, Typography, Skeleton, Box } from '@mui/material'
import { useAuthStore } from '@/store/auth.store'

const STAT_CARDS = [
  { label: 'Total Invoices', value: '—' },
  { label: 'Paid', value: '—' },
  { label: 'Pending', value: '—' },
  { label: 'Overdue', value: '—' },
]

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Welcome back, {user?.name?.split(' ')[0] ?? '…'} 👋
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {user?.business_name}
      </Typography>
      <Grid container spacing={3}>
        {STAT_CARDS.map(({ label, value }) => (
          <Grid item xs={12} sm={6} md={3} key={label}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {label}
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {value === '—' ? <Skeleton width={60} /> : value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
