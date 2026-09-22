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
import { Container, Grid } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import { apiGetClubCategories } from "../utils/api/clubsApi";
import ClubCategory from "../models/clubsCategoryModel";
import customMaxWidthContainer from "../features/common/CustomMaxWidth";
import "../styles/home.scss";
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
  const [eventsData, setEventsData] = useState<EventModel[]>([])
  const [clubCategories, setClubCategories] = useState<ClubCategory[]>([])
  usePageAuth();

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

      const clubCategoriesRes = await apiGetClubCategories({
        reqQuery: {
          type: 0,
          parentId: -1,
        }
      })
      if (clubCategoriesRes.status === RESPONSE_SUCCESS) {
        setClubCategories(clubCategoriesRes.data)
      }
    })()
  }, [])

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
      <EventComponent title="Sự kiện sắp diễn ra" eventsData={eventsData} />
      <section className="home-org-section">
        <Container maxWidth={customMaxWidthContainer()}>
          <div className="home-section-heading">
            <div>
              <span>Mạng lưới tổ chức</span>
              <h2>Tổ chức trực thuộc</h2>
              <p>Các Liên chi Hội, câu lạc bộ và đội nhóm trực thuộc Hội Sinh viên Đại học Bách khoa Hà Nội.</p>
            </div>
            <button onClick={() => router.push("/to-chuc/tat-ca-to-chuc")}>
              Xem toàn bộ đơn vị <ArrowForwardIcon />
            </button>
          </div>
          <Grid container spacing={2.5}>
            {clubCategories.slice(0, 4).map((item) => {
              const description = (item.des || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
              return (
                <Grid item xs={12} sm={6} md={3} key={item._id || item.slug}>
                  <article className="home-org-card" onClick={() => router.push(`/to-chuc/${item.slug}`)}>
                    <div className="home-org-card-icon">{item.name?.slice(0, 1) || "T"}</div>
                    <div className="home-org-card-label">Danh mục tổ chức</div>
                    <h3>{item.name}</h3>
                    <p>{description || "Các đơn vị trực thuộc cùng xây dựng phong trào sinh viên năng động, sáng tạo và trách nhiệm."}</p>
                    <div className="home-org-card-footer">
                      <span>{item.clubNum ? `${item.clubNum}+ đơn vị` : "Xem danh mục"}</span>
                      <ArrowForwardIcon />
                    </div>
                  </article>
                </Grid>
              )
            })}
          </Grid>
        </Container>
      </section>
      <section className="home-sv5t-cta">
        <Container maxWidth={customMaxWidthContainer()}>
          <div className="home-sv5t-panel">
            <div className="home-sv5t-content">
              <div className="home-sv5t-badge"><FactCheckIcon /> Danh hiệu cao quý</div>
              <h2>Chinh phục danh hiệu “Sinh viên 5 tốt” cùng Hội Sinh viên Đại học Bách khoa Hà Nội</h2>
              <p>Minh chứng thuyết phục cho sự toàn diện của sinh viên Bách khoa: Đạo đức tốt, Học tập tốt, Thể lực tốt, Tình nguyện tốt và Hội nhập tốt.</p>
              <div className="home-sv5t-tags">
                <span>Đạo đức tốt</span>
                <span>Học tập tốt</span>
                <span>Thể lực tốt</span>
                <span>Tình nguyện tốt</span>
                <span>Hội nhập tốt</span>
              </div>
            </div>
            <button className="home-sv5t-action" onClick={() => router.push("/sinh-vien-5-tot/ho-so")}>
              Xét duyệt hồ sơ <ArrowForwardIcon />
            </button>
          </div>
        </Container>
      </section>
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
