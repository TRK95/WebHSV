import { useMediaQuery } from "@mui/material";
import { Container, Grid } from "@mui/material";
import { useTheme } from "@mui/system";
import Image from "next/image";
import customMaxWidthContainer from "../../features/common/CustomMaxWidth";
import './childrenFooter.scss'

export const childrenFooterDataArr = [
    {
        image: '/images/children-footer/vnpt.png'
    },
    {
        image: '/images/children-footer/evn.png'
    },
    {
        image: '/images/children-footer/investing.png'
    },
    {
        image: '/images/children-footer/habeco.png'
    },
    {
        image: '/images/children-footer/nbtn.png'
    },
    {
        image: '/images/children-footer/vinatex.png'
    },
]

function ChildrenFooter() {

    return (
        <div id="children-footer">
            <Container maxWidth={customMaxWidthContainer()}>
                <div className="children-footer-list">
                    <Grid container spacing={2}>
                        {childrenFooterDataArr.map(children => (
                            <Grid item xs={6} sm={4} md={2} key={children.image}>
                                <div className="children-footer-item">
                                    <Image objectFit="cover" src={children.image} layout="responsive" width={180} height={96} />
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </Container>
        </div>
    );
}

export default ChildrenFooter;