import { Skeleton } from "@mui/material"

const SkeletonView = () => {
    return (
        <ul style={{ paddingLeft: '0px', listStyleType: 'none', }}>
            {
                Array.from(new Array(4)).map(item => (
                    <li style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', }}>
                        <Skeleton width="100%" />
                    </li>
                ))
            }
        </ul >
    )
}

export default SkeletonView