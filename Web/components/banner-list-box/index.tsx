import { Grid } from "@mui/material";
import { AlumniIcon, ClubIcon, YearFoundedIcon } from "./iconList";
import { Container, useMediaQuery } from '@mui/material'
import './style.scss'
import { useTheme } from '@mui/system';
import CountUp from 'react-countup';

export const dataArray = [
    {
        type: "student",
        icon: <AlumniIcon />,
        number: 37,
        desc: 'Cựu sinh viên'
    },
    {
        type: "year",
        icon: <YearFoundedIcon />,
        number: 50,
        desc: 'Năm thành lập'
    },
    {
        type: "club",
        icon: <ClubIcon />,
        number: 50,
        desc: 'Tổ chức'
    }
]

function BannerListBox() {
    const theme = useTheme()
    const isLgDeskopUI = useMediaQuery(theme.breakpoints.down('xxl'))
    return (
        <Container maxWidth={isLgDeskopUI ? 'lg' : 'xl'}>
            <div id="banner-list-box" data-aos="fade-up">
                <div className="banner-list-box-body">
                    <Grid container spacing={4}>
                        {dataArray.map((item, index) => (
                            <Grid item md={4} sm={4} xs={4} key={index}>
                                <div key={index} className="banner-box-item">
                                    <div className="banner-box-item-icon">{item.icon}</div>
                                    <div className="banner-box-item-number dot-2">
                                        <CountUp end={item.number} duration={3} />
                                        {item.type !== "year" && item.type !== "club" ? "K+" : '+'}
                                    </div>
                                    <div className="banner-box-item-desc small-size-text dot-2">{item.desc}</div>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </div>
        </Container >
    );
}

export default BannerListBox;