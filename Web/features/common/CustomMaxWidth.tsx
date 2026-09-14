import { useTheme, useMediaQuery } from '@mui/material'

const customMaxWidthContainer = () => {
    const theme = useTheme()
    const isLgDesktopUI = useMediaQuery(theme.breakpoints.down('xxl'))

    return isLgDesktopUI ? 'lg' : 'xl'
}

export default customMaxWidthContainer