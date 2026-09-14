import { Container, Grid, useMediaQuery, useTheme } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import AppDownloadButton from '../../features/common/AppDownloadButton'
import customMaxWidthContainer from '../../features/common/CustomMaxWidth'
import NextLink from "../NextLink"
import ChildrenFooter from './ChildrenFooter'
import './style.scss'


const Footer = ({ bgImage }: { bgImage?: string }) => {
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down('lg'));
  const isSmallTabletUI = useMediaQuery(theme.breakpoints.down('md'))
  const isMobileUI = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter()

  return (<>
    <div id="footer">
      <Container maxWidth={customMaxWidthContainer()} sx={{ display: 'flex', alignItems: 'center', height: '100%' }} >
        <Grid container spacing={2} className='main-footer'>
          <Grid item md={3} sm={12} xs={12} sx={{ zIndex: 100 }}>
            <div>
              <div className='left-footer'>
                <Image src="/images/logo.png" priority={true} width={!isSmallTabletUI ? 210 : 180} height={!isSmallTabletUI ? 210 : 180} className='left-footer-logo' />
              </div>
              {/* <a href="//www.dmca.com/Protection/Status.aspx?ID=0160c9fd-562f-4410-a64c-e1858b34c389" title="DMCA.com Protection Status" className="dmca-badge"> <img src="https://images.dmca.com/Badges/dmca-badge-w150-5x1-01.png?ID=0160c9fd-562f-4410-a64c-e1858b34c389" alt="DMCA.com Protection Status" /></a>  <script src="https://images.dmca.com/Badges/DMCABadgeHelper.min.js"> </script> */}
            </div>
          </Grid>
          <Grid item md={4} sm={6} xs={12} sx={{ zIndex: 100 }} className='center-footer'>
            <div className="center-footer-text">
              <div className="footer-title" >GIỚI THIỆU</div>
              Hội Sinh viên Đại học Bách Khoa Hà Nội <br />
              Địa chỉ: P101, KTX B8, Trường ĐH Bách khoa Hà Nội · Hà Nội, Hanoi, Vietnam<br />
              Email: hsv@hust.edu.vn
            </div>

            <div className="center-footer-connect-desc">Connect with us</div>
            <div className="center-footer-connect-contact">
              {/* <Image src="/images/social/tumblr.png" width={25} height={25} /> */}
              <NextLink
                href="https://www.facebook.com/hoisinhvienbkhn"
                aProps={{ target: "_blank", rel: "nofollow" }}
              >
                <Image src="/images/facebook.svg" width={30} height={30} />
              </NextLink>
              <NextLink
                href="https://www.youtube.com/channel/UCuZyaINTwpDHM3lQNNvNIVg"
                aProps={{ target: "_blank", rel: "nofollow" }}
              >
                <Image src="/images/social/youtube.svg" width={30} height={30} />
              </NextLink>
              <NextLink
                href="https://www.flickr.com/photos/cedhust"
                aProps={{ target: "_blank", rel: "nofollow" }}
              >
                <Image src="/images/social/flickr.svg" width={30} height={30} />
              </NextLink>
            </div>
          </Grid>
          <Grid item sx={{ zIndex: 100 }} md={5} sm={6} xs={12}>
            <div className="right-footer">
              <Grid container spacing={0} style={{ flexDirection: "column" }}>
                <Grid item xs={12} md={12} sm={6}>
                  <div className="footer-title" >Bản đồ chỉ dẫn</div>
                </Grid>
                <Grid item xs={12} md={12} sm={12}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6885245219164!2d105.84416467625698!3d21.005119180638346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac767fb412d5%3A0xa15e3744fef76fda!2zS8OtIFTDumMgWMOhIELDoWNoIEtob2E!5e0!3m2!1sen!2s!4v1713502117993!5m2!1sen!2s"
                    className='right-footer-map'
                    style={{ border: "0", borderRadius: "8px" }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade">
                  </iframe>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  </>
  )
}

export default Footer;