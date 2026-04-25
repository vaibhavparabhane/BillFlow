'use client'

import { useState, forwardRef } from 'react'
import { TextField, InputAdornment, IconButton, TextFieldProps } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

type PasswordFieldProps = Omit<TextFieldProps, 'type'>

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  props,
  ref,
) {
  const [show, setShow] = useState(false)

  return (
    <TextField
      {...props}
      type={show ? 'text' : 'password'}
      inputRef={ref}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShow((v) => !v)} edge="end" size="small">
              {show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
})

export default PasswordField
