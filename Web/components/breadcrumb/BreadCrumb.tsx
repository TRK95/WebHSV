import { Breadcrumbs, Link, useTheme } from '@mui/material'
import React from 'react'
import './style.scss'
import Tooltip from '@mui/material/Tooltip'
import useMediaQuery from '@mui/material/useMediaQuery'

export default function BreadCrumb({ path }: { path: Array<{ label: string, slug: string }> }) {
    // const breadCrumbs = path?.map((_path, index) => {
    //     if (index < 3 && index > 0)
    //         return {
    //             ..._path,
    //             slug: path.slice(0, index + 1).map(_p => _p.slug).join('/')
    //         }
    //     else return _path;
    // });
    const theme = useTheme()
    const isMobileUI = useMediaQuery(theme.breakpoints.down('sm'))

    return (
        <div className="breadcrumb-component">
            <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{
                '& .MuiBreadcrumbs-li:last-child': {
                    maxWidth: isMobileUI ? '200px' : '500px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    wordBreak: 'break-word',
                    flex: 1,
                },
                '& .MuiBreadcrumbs-li:last-child a': {
                    color: 'var(--primary-color-main)',
                    textDecoration: 'underline'
                }
            }}>
                <Link underline="hover" color="inherit" href="/">
                    Trang chủ
                </Link>
                {path?.length > 0 && path?.map((item, index) =>
                    <Tooltip key={index} title={item?.label} placement="bottom">
                        <Link underline="hover" color="inherit" href={`/${item?.slug ?? ''}/`}>
                            {item?.label}
                        </Link>
                    </Tooltip>
                )
                }
            </Breadcrumbs>
        </div >
    )
}
