
import { Button, ButtonProps } from "@mui/material";
import React, { PropsWithChildren } from "react";

type TypeButtonProps = ButtonProps & {
    children?: React.ReactNode
    istransition?: boolean
}

function CustomButton(props: PropsWithChildren<TypeButtonProps>) {
    const { istransition, children, sx } = props

    return (
        <Button {...props} sx={{
            transition: '0.5s',
            '&:hover': {
                transform: 'translateY(-4px) !important',
            },
            ...sx
        }}>
            {children}
        </Button>
    );
}

export default CustomButton;