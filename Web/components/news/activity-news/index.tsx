import { Grid } from "@mui/material";
import { Container } from "@mui/system";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import customMaxWidthContainer from "../../../features/common/CustomMaxWidth";
import NewsModel from "../../../models/newsModel";
import { RESPONSE_SUCCESS } from "../../../utils/constraint";
import "./style.scss";
import { apiGetNewsByDate } from "../../../utils/api/newsApi";
import NewsInCategory from "../../../models/newsIncategory";
import moment from "moment";
import { getDisplayImage } from "../../../utils/image";

export const MAX_DATA_DISPLAY = 8;

type NewsItem = NewsModel & {
  inCategories?: NewsInCategory[];
};

const openNews = (item?: NewsItem) => {
  if (!item?.slug) return;
  window.location.href = `/${item.slug}`;
};

const NewsCard = ({ item, featured = false }: { item: NewsItem; featured?: boolean }) => (
  <article className={featured ? "news-card news-card-featured" : "news-card"} onClick={() => openNews(item)}>
    <div className="news-card-image">
      <Image objectFit="cover" src={getDisplayImage(item?.avatar)} layout="fill" />
    </div>
    <div className="news-card-content">
      <div className="news-card-date">{moment(item?.createDate).format("DD/MM/YYYY")}</div>
      <h3>{item?.title}</h3>
      {featured && item?.shortDes && <p>{item.shortDes}</p>}
    </div>
  </article>
);

function News({ title }: { title?: string }) {
  const [newsArrayData, setNewsArrayData] = useState<NewsItem[]>([]);

  useEffect(() => {
    (async function () {
      const response = await apiGetNewsByDate({
        reqQuery: {
          limit: MAX_DATA_DISPLAY,
          offset: 0,
        }
      });

      if (response.status === RESPONSE_SUCCESS) {
        setNewsArrayData(response.data);
      }
    })();
  }, []);

  const featured = newsArrayData[0];
  const secondaryNews = useMemo(() => newsArrayData.slice(1, MAX_DATA_DISPLAY), [newsArrayData]);

  return (
    <section id="activity-and-news">
      <Container maxWidth={customMaxWidthContainer()}>
        <div className="section-heading">
          <div>
            <span>Tin mới</span>
            <h2>{title}</h2>
          </div>
          <button onClick={() => window.location.href = "/tin-tuc/tat-ca-tin-tuc"}>Xem tất cả</button>
        </div>

        {newsArrayData.length > 0 && (
          <Grid container spacing={2.5} className="news-grid">
            {featured && (
              <Grid item xs={12} md={6}>
                <NewsCard item={featured} featured />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <Grid container spacing={2.5}>
                {secondaryNews.slice(0, 4).map((item) => (
                  <Grid item xs={12} sm={6} key={item._id || item.slug}>
                    <NewsCard item={item} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        )}
      </Container>
    </section>
  );
}

export default News;
