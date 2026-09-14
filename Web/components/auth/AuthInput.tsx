import { InputAdornment, InputBase, InputBaseProps, InputProps, TextField, TextFieldProps } from '@mui/material'
import React, { forwardRef, PropsWithoutRef, ReactNode } from 'react'
import './style.scss'

type TypeAuthInputProps = {
  labelInput: string,
  labelInputActions?: ReactNode,
  icon?: JSX.Element,
  inputBaseProps?: InputBaseProps
}

const AuthInput = (props: PropsWithoutRef<TypeAuthInputProps>, ref) => {
  const { labelInput, icon, inputBaseProps, labelInputActions } = props
  const { ...TextFieldProps } = inputBaseProps
  return (
    <div id="auth-input">
      <div className="auth-input-label">
        {icon}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', minHeight: '32px' }}>
          <div className="auth-input-label-text" style={{ marginLeft: '6px', width: '100%' }}>
            {labelInput}
          </div>
          <div className="auth-input-label-actions">
            {labelInputActions}
          </div>
        </div>
      </div>
      <InputBase
        {...(TextFieldProps) as InputBaseProps}
        inputRef={ref}
        inputProps={{
          ...TextFieldProps?.inputProps,
        }}
        sx={{
          ...TextFieldProps?.sx,
          fontFamily: "inherit"
        }}
      />
    </div>
  )
}

export default AuthInput