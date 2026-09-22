import { useTheme, useMediaQuery } from '@mui/material'

const customMaxWidthContainer = () => {
    const theme = useTheme()
    const isBelowXxl = useMediaQuery(theme.breakpoints.down('xxl'))

    return isBelowXxl ? 'xl' : 'xxl'
}

export default customMaxWidthContainer
