'use client'

import { Card, CardContent, Box, Typography } from '@mui/material'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'

interface AuthCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <Card sx={{ width: '100%', maxWidth: 460, p: { xs: 1, sm: 2 } }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <ReceiptLongIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h5" color="primary.main">
            BillOps
          </Typography>
        </Box>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {subtitle}
          </Typography>
        )}
        {children}
      </CardContent>
    </Card>
  )
}
