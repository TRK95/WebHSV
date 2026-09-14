import {
  Container,
  Grid,
  Stack,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import customMaxWidthContainer from "../../../features/common/CustomMaxWidth";
import EventModel from "../../../models/eventModel";
import { apiGetEventsByDate } from "../../../utils/api/eventsApi";
import { PAGE_SIZE, RESPONSE_SUCCESS, STATUS_NO_REGISTER } from "../../../utils/constraint";
import { MAX_DATA_DISPLAY } from "../../news/activity-news";
import NextLink from "../../NextLink";
import "./style.scss";
import BreadCrumb from "../../breadcrumb/BreadCrumb";
import moment from "moment";
import NonAccentVietnamese from "../../../utils/checkNonVietNameseAccent"
import Image from "next/image";

enum EventStatus {
  ALL = 0,
  COMMING = 1,
  HAPPENING = 2,
  OVER = 3,
}

function EventsPageView({
  slug,
  eventsData,
  dataEventCategories,
  totalEvents,
  pageQuery,
  start,
  end
}: {
  slug?: string;
  eventsData: EventModel[];
  dataEventCategories: Array<{ name: string; slug: string; type: number }>;
  totalEvents: number,
  pageQuery: number,
  start: number,
  end: number
}) {
  const router = useRouter(); ``
  // const [eventsData, setEventsData] = useState<Array<EventModel>>([])
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [totalFilterEvents, setTotalFilterEvents] = useState(0);
  const [searchValue, setSearchValue] = useState<string>('')
  const [page, setPage] = useState(1);
  const [path, setPath] = useState({
    label: dataEventCategories?.filter((item) => item.slug === slug)?.[0]?.name,
    slug: dataEventCategories?.filter((item) => item.slug === slug)?.[0]?.slug,
  });
  const [eventsByDate, setEventsByDate] = useState<Array<EventModel>>([]);
  const [type, setType] = useState(
    dataEventCategories?.filter((item) => item.slug === slug)?.[0]?.type
  );
  const miliSecondsNow = moment().valueOf();

  const handleChangePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    router.push({
      pathname: `/su-kien/${slug}`,
      query: {
        page: value,
      }
    });
    setPage(value);
    setOffset((value - 1) * PAGE_SIZE);
  };

  // useEffect(() => {
  //   const fetchClubHost = async () => {
  //     const result = await apiGetClubCategories
  //   }
  // })

  useEffect(() => {
    if (eventsData.length > 0) {
      if (type === EventStatus.ALL) {
        setEventsByDate(eventsData);
      } else if (type === EventStatus.COMMING) {
        setEventsByDate(eventsData.filter((item) => item.fromDate > miliSecondsNow));
        setTotalFilterEvents(eventsData.filter((item) => item.fromDate > miliSecondsNow).length)
      } else if (type === EventStatus.HAPPENING) {
        setEventsByDate(
          eventsData.filter((item) => miliSecondsNow >= item.fromDate && miliSecondsNow <= item.toDate)
        );
        setTotalFilterEvents(eventsData.filter(
          (item) =>
            miliSecondsNow >= item.fromDate && miliSecondsNow <= item.toDate
        ).length)
      } else if (type === EventStatus.OVER) {
        setEventsByDate(eventsData.filter((item) => item.toDate < miliSecondsNow));
        setTotalFilterEvents(eventsData.filter((item) => item.toDate < miliSecondsNow).length)
      }
    }

    setEventsByDate((prev) => prev.slice(start, end))
  }, [type, slug, pageQuery]);

  useEffect(() => {
    const eventCategory = dataEventCategories.filter(item => item?.slug === slug)
    if (eventCategory) {
      setType(eventCategory[0]?.type)
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [slug]);

  const handleChangeCate = (item: {
    name: string;
    slug: string;
    type: number;
  }) => {
    router.push(`/su-kien/${item.slug}`);
    setPath({
      label: item.name ?? "",
      slug: `su-kien/${item.slug ?? ""}`,
    });
    window.scrollTo(0, 0);
    setType(item.type);

    if (slug === item.slug) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  };

  return (
    <div id="event-page-view">
      <Container maxWidth={customMaxWidthContainer()}>
        <BreadCrumb
          path={[
            { label: "Sự kiện", slug: "su-kien/tat-ca-su-kien" },
            { label: path?.label, slug: path?.slug },
          ]}
        />
        <Grid container>
          <Grid item xs={12} sm={4} md={3}>
            <div className="event-page-view-side-bar-wrapper">
              <div className="event-page-view-side-bar">
                <ul>
                  {dataEventCategories.map((item) => (
                    <li
                      key={item.name}
                      onClick={() => handleChangeCate(item)}
                      className={slug && slug === item.slug ? "active" : ""}
                    >
                      <p>{item.name}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={8} md={9}>
            <div className="event-page-view-header">
              <div className="event-page-view-header-title title-h1">
                <div className="title-h1-icon">
                  <Image src='/images/icon-head-subject.svg' layout='responsive' width={20} height={20} />
                </div>
                {dataEventCategories.find(item => item?.slug === slug) ? dataEventCategories.find(item => item?.slug === slug)?.name : "Tất cả sự kiện"}
              </div>
              <div className="event-page-view-header-actions">
                <input type="search" onChange={(e) => setSearchValue(e.target.value)} placeholder="Tìm kiếm" />
              </div>
            </div>
            {!loading ? (
              eventsByDate.length > 0 ?
                eventsByDate.map((item, index) => {
                  const searchValueNoAccent = NonAccentVietnamese(searchValue)
                  const eventName = NonAccentVietnamese(item.title)
                  if (eventName.includes(searchValueNoAccent)) {
                    return <Grid key={index} item xs={12} sm={12} md={12}>
                      <NextLink href={`/su-kien/${slug}/${item.slug}`}>
                        <div className="event-page-view-item">
                          <div className="event-page-view-item-image">
                            <img
                              style={{ objectFit: "contain" }}
                              src={item?.avatar ? item?.avatar : "/images/huy-hieu-hoi.png"}
                              width={300}
                              height={200}
                              alt={item?.title}
                            />
                          </div>
                          <div className="event-page-view-item-content">
                            <h3 className="event-page-view-item-title">
                              {item?.title}
                            </h3>
                            <strong style={{ color: "var(--primary-color-main)" }}>
                              {`Thời gian diễn ra: ${moment(item?.fromDate).format(
                                "DD/MM/YYYY"
                              )} - ${moment(item?.toDate).format("DD/MM/YYYY")}`}
                            </strong>
                            <br />
                            {item.settingStatus !== STATUS_NO_REGISTER
                              && <strong style={{ color: "var(--secondaryColor)" }}>
                                {`Đăng ký tham gia: ${moment(item?.registerFromDate).format(
                                  "DD/MM/YYYY"
                                )} - ${moment(item?.registerToDate).format("DD/MM/YYYY")}`}
                              </strong>
                            }
                            {/* <p className="event-page-view-item-desc dot-5">
                       {item?.criteria}
                     </p> */}
                            <div
                              className="event-page-view-item-desc dot-5"
                              dangerouslySetInnerHTML={{ __html: item?.criteria }}
                            ></div>
                          </div>
                        </div>
                      </NextLink>
                    </Grid>
                  }
                })
                :
                <div style={{ margin: "100px auto", textAlign: "center" }}>
                  Chưa có sự kiện nào
                </div>
            ) : (
              <div style={{ margin: "100px auto", textAlign: "center" }}>
                <CircularProgress />
              </div>
            )}
          </Grid>
          <Grid item sm={12} xs={12} md={12}>
            <div className="event-page-view-pagination">
              <Stack spacing={2}>
                <Pagination
                  style={{ display: "flex", justifyContent: " center" }}
                  count={type === EventStatus.ALL ? Math.ceil(totalEvents / MAX_DATA_DISPLAY) : Math.ceil(totalFilterEvents / MAX_DATA_DISPLAY)}
                  page={pageQuery}
                  onChange={handleChangePagination}
                />
              </Stack>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default EventsPageView;
