import { useSelector } from "../app/hooks";
import { EventComponent } from "../components/events/event-component";
import Layout from "../features/common/Layout";
import usePageAuth from "../hooks/usePageAuth";
import { getWebSEOProps } from "../utils/getSEOProps";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import News from "../components/news/activity-news";
import { RESPONSE_SUCCESS } from "../utils/constraint";
import { apiGetEventsByDate } from "../utils/api/eventsApi";
import EventModel from "../models/eventModel";
import { META_ROBOT_INDEX_FOLLOW } from "../modules/share/constraint";
import { useRouter } from "next/router";
import PaginationHome from "../components/Swiper/PaginationHome";
import { Pagination } from "swiper";
type IndexPageProps = {
  // seoInfo: WebSeo;
  // postData: WPPost[];
  // categories: Category[];
  // introduceNav: Array<NavItem>
  eventsData: Array<EventModel>
};
const pagination = {
  clickable: true,
  el: '.pagination-swiper'
}

const IndexPage = () => {
  const router = useRouter();
  const [eventsData, setEventsData] = useState([])
  const student = useSelector(state => state.authState.student)

  useEffect(() => {
    Aos.init({ duration: 1500 });
  }, [])
  // const appInfo = useSelector((state) => state.appInfos.appInfo);
  // const seoInfo = useSelector((state) => state.appInfos.seoInfo);

  useEffect(() => {
    (async () => {
      const eventSDataRes = await apiGetEventsByDate({
        reqQuery: {
          limit: 20,
          offset: 0,
        }
      })
      if (eventSDataRes.status === RESPONSE_SUCCESS) {
        setEventsData(eventSDataRes.data)
      }
    })()
  }, [])
  usePageAuth();

  const dataBanners = [
    {
      url: "/images/banner/banner1.png"
    },
    {
      url: "/images/banner/banner2.png"
    },
    {
      url: "/images/banner/banner3.png"
    },
    {
      url: "/images/banner/banner4.png"
    }
  ]

  return (
    <Layout
      {...getWebSEOProps({
        seoTitle: 'Hội Sinh viên Đại học Bách khoa Hà Nội - 5 năm học không dài như bạn nghĩ, hãy chuyển động cùng với chúng tôi',
        descriptionSeo: 'Hội Sinh viên Đại học Bách khoa Hà Nội - 5 năm học không dài như bạn nghĩ, hãy chuyển động cùng với chúng tôi',
        metaRobot: META_ROBOT_INDEX_FOLLOW,
        slug: router?.asPath ?? ''
      })}
    // {...getWebAppProps(appInfo)}
    >
      {/* <HeroSection
        titleH1='HANOI UNIVERSITY OF SCIENCE AND TECHNOLOGY'
        // summary='Mô tả lợi ích của người dùng'
        bgImage={`/images/bg-hero-section.png`}
        minHeight={480}
        layoutBg="full-text-left"
      // ctaElement={ctaHeroSection}
      /> */}
      <PaginationHome modules={[Pagination]} pagination={pagination} data={dataBanners} />
      <News title='Tin tức nổi bật' />
      {/* <CategoryCourse title={seoInfo?.titleH1} description={seoInfo?.summary} categories={categories} /> */}
      {eventsData.length > 0 && <EventComponent title="Sự kiện sắp diễn ra" eventsData={eventsData} />}
      {/* <NetworkStanding title="Thường trực mạng lưới ALUMNI" />
      <HonorStudent title="Vinh danh" />
      <InforSearching title="Tra cứu" /> */}
      {/* {!student &&
        <RegisterForm isPopUp={false} />
      } */}
    </Layout>
  );
};

export default IndexPage;
