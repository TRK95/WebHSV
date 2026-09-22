import { Button, Container, Grid, useMediaQuery, useTheme } from '@mui/material';
import moment from 'moment';
import Image from 'next/image';
import customMaxWidthContainer from '../../../features/common/CustomMaxWidth';
import EventModel from '../../../models/eventModel';
import './style.scss';
import "swiper/swiper.min.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import { STATUS_NO_REGISTER } from '../../../utils/constraint';
import _ from 'lodash';
import { useMemo, useEffect, useState } from 'react';
import { AccessTime, CalendarViewMonth, DateRange, LocationOn, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { useRouter } from 'next/router';

export const EventComponent = ({ title, eventsData, isProfile }: { title?: string, eventsData?: Array<EventModel>, isProfile?: boolean }) => {
  const theme = useTheme()
  const router = useRouter()
  const isTabletUI = useMediaQuery(theme.breakpoints.down('lg'))
  const isSmallTabletUI = useMediaQuery(theme.breakpoints.down('md'))
  const handleDetailEvent = (slug) => {
    router.push(`/su-kien/tat-ca-su-kien/${slug}`)
  }
  const [_eventsData, set_EventsData] = useState(eventsData)
  const miliSecondsNow = moment().valueOf();
  const _eventsDataHappening = useMemo(() => {
    return _.sampleSize(eventsData.filter(item => miliSecondsNow >= item.fromDate && miliSecondsNow <= item.toDate), 4)
  }, [])
  const _eventsCommingUp = useMemo(() => {
    return _.sampleSize(eventsData.filter((item) => item.fromDate > miliSecondsNow), 2)
  }, [])
  const _eventsOver = useMemo(() => {
    return _.sampleSize(eventsData.filter((item) => item.toDate < miliSecondsNow), 6)
  }, [])

  useEffect(() => {
    if (!isProfile) {
      if (_eventsDataHappening.length < 6) {
        if (_eventsCommingUp.length + _eventsDataHappening.length < 6) {
          set_EventsData([..._eventsDataHappening, ..._eventsCommingUp, ..._eventsOver])
        } else {
          set_EventsData([..._eventsDataHappening, ..._eventsCommingUp])
        }
      } else {
        set_EventsData(_eventsDataHappening)
      }
    } else {
      set_EventsData(eventsData)
    }
  }, [isProfile, eventsData])

  return (
    <>
      <div data-aos="fade-up" className="event-comming">
        <Container maxWidth={customMaxWidthContainer()}>
          <div className="event-comming-title title-h1">
            <div className="title-h1-icon"><Image src='/images/icon-head-subject.svg' layout='responsive' width={20} height={20} /></div>
            {title}
          </div>
          {_eventsData.slice(0, 6)?.length > 0
            ? <>
              <Swiper
                key={1}
                autoplay={{ delay: 15000, disableOnInteraction: false }}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
                loop={true}
                slidesPerView={isSmallTabletUI ? 1 : 4}
                slidesPerGroup={isSmallTabletUI ? 1 : 4}
                spaceBetween={15}
                // modules={[Pagination]}
                className="swiper-achievement"
                pagination={{
                  clickable: true,
                  el: ".swiper-pagination",
                  renderBullet: function (index, className) {
                    return '<span class="' + className + '">' + (index + 1) + "</span>";
                  }
                }}
              >
                {_eventsData.slice(0, 6).map(item => (
                  <SwiperSlide key={item._id}>
                    <div className="event-comming-slider-item" onClick={() => router.push(`/su-kien/tat-ca-su-kien/${item?.slug}`)}>
                      <Grid container spacing={2} >
                        <Grid item xs={isSmallTabletUI ? 5 : 12} sm={isSmallTabletUI ? 5 : 12} md={isSmallTabletUI ? 5 : 12}>
                          <div className="event-comming-slider-item-image" style={{ width: '100%' }}>
                            <Image objectFit='contain' src={item?.avatar ? item.avatar : '/images/huy-hieu-hoi.png'} width={300} height={200} layout='responsive' className='image' />
                          </div>
                        </Grid>
                        <Grid item xs={isSmallTabletUI ? 7 : 12} sm={isSmallTabletUI ? 7 : 12} md={isSmallTabletUI ? 7 : 12}>
                          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                            <div className="event-comming-slider-item-content">
                              <p style={{ fontSize: `${isTabletUI && '16px'}` }} className='event-comming-slider-item-content-title'>{item?.title}</p>
                              <p className='event-comming-slider-item-content-info'>
                                <AccessTime style={{ color: 'var(--primary-color-main)' }} />
                                {moment(item?.fromDate).format('DD/MM/YYYY')} -  {moment(item?.toDate).format('DD/MM/YYYY')}
                              </p>
                              {item.settingStatus !== STATUS_NO_REGISTER
                                && <p className='event-comming-slider-item-content-info'>
                                  <DateRange style={{ color: 'var(--primary-color-main)' }} />
                                  {moment(item?.registerFromDate).format('DD/MM/YYYY')} - {moment(item?.registerToDate).format('DD/MM/YYYY')}</p>
                              }
                              <p className='event-comming-slider-item-content-info' style={{ alignItems: "flex-start" }}>
                                <LocationOn style={{ color: 'var(--primary-color-main)' }} />
                                Sân C9 - Trường Đại học Bách khoa Hà Nội
                              </p>
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </SwiperSlide>
                ))
                }
              </Swiper>
              <div className="swiper-button-prev"><NavigateBefore /></div>
              <div className="swiper-button-next"><NavigateNext /></div>
            </>
            : <h3>Không có sự kiện nào đang diễn ra</h3>
          }
        </Container>
      </div>
    </>
  )
}
