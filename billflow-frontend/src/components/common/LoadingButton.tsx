import { Button, ButtonProps, CircularProgress } from '@mui/material'

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean
}

export default function LoadingButton({ loading, disabled, children, ...props }: LoadingButtonProps) {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={18} color="inherit" /> : props.startIcon}
    >
      {children}
    </Button>
  )
}
