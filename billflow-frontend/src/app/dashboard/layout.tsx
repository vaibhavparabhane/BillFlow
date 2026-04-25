'use client'

import { useState } from 'react'
import { Box, Toolbar } from '@mui/material'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import Sidebar from '@/components/layout/Sidebar'
import TopNavbar from '@/components/layout/TopNavbar'
import { DRAWER_WIDTH } from '@/lib/constants'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <ProtectedRoute>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <TopNavbar onMenuClick={() => setMobileOpen((v) => !v)} />
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
            bgcolor: 'background.default',
            minHeight: '100vh',
          }}
        >
          <Toolbar />
          <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>
        </Box>
      </Box>
    </ProtectedRoute>
  )
}
