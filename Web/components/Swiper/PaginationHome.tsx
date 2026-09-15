import { Skeleton, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SwiperModule } from "swiper/types";
import './style.scss';

const PaginationHome = (props: {
  modules?: SwiperModule[],
  pagination?: any,
  data: Array<any>
}) => {
  const { modules: modulesProps, pagination, data } = props
  const theme = useTheme();
  const isMobileUI = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timerId = setTimeout(() => {
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timerId)
  }, [])

  return (
    <div className="banner-panel">
      {loading
        ? <Skeleton variant="rectangular" height={isMobileUI ? 150 : 400} />
        : <>
          {data.length > 0 &&
            <div style={{ position: "relative" }}>
              <div className="swiper-button image-swiper-button-next">
                {/* <ArrowForwardIosIcon /> */}
                <Image src="/images/icon/next.svg" width={48} height={48} />
              </div>
              <div className="swiper-button image-swiper-button-prev">
                {/* <ArrowBackIosNew /> */}
                <Image src="/images/icon/back.svg" width={48} height={48} />
              </div>
              <Swiper
                className="mySwiperCustomBanners"
                loop
                autoplay={{ delay: 3000, disableOnInteraction: true }}
                // modules={modulesProps ? modulesProps : []}
                data-aos="fade-down"
                navigation={{
                  nextEl: ".image-swiper-button-next",
                  prevEl: ".image-swiper-button-prev",
                  disabledClass: "swiper-button-disabled"
                }}
              // modules={[Navigation]}
              >
                {data?.map((i, index) => (
                  <SwiperSlide key={index} >
                    <div className="banner-image-frame">
                      <Image src={i?.url} layout="fill" objectFit="cover" priority={index === 0} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          }
        </>
      }
      <div className='pagination-swiper'></div>
    </div>
  );
};

export default PaginationHome;
