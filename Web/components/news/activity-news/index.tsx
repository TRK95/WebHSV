import { Grid } from "@mui/material";
import { Container } from "@mui/system";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import customMaxWidthContainer from "../../../features/common/CustomMaxWidth";
import NewsModel from "../../../models/newsModel";
import { RESPONSE_SUCCESS } from "../../../utils/constraint";
import "./style.scss";
import { apiGetNewsByDate } from "../../../utils/api/newsApi";
import NewsInCategory from "../../../models/newsIncategory";
import moment from "moment";
import { getDisplayImage } from "../../../utils/image";
import { stripHtmlToText } from "../../../utils/format";

export const MAX_DATA_DISPLAY = 8;

type NewsItem = NewsModel & {
  inCategories?: NewsInCategory[];
};

const NewsCard = ({ item, featured = false, onOpen }: { item: NewsItem; featured?: boolean; onOpen: (item: NewsItem) => void }) => {
  const summary = stripHtmlToText(item?.shortDes || item?.content || "");

  return (
    <article className={featured ? "news-card news-card-featured" : "news-card news-card-compact"} onClick={() => onOpen(item)}>
      <div className="news-card-image">
        <Image objectFit="cover" src={getDisplayImage(item?.avatar)} layout="fill" />
      </div>
      <div className="news-card-content">
        <div className="news-card-date">{moment(item?.createDate).format("DD/MM/YYYY")}</div>
        <h3>{item?.title}</h3>
        {summary && <p>{summary}</p>}
      </div>
    </article>
  );
};

function News({ title }: { title?: string }) {
  const router = useRouter();
  const [newsArrayData, setNewsArrayData] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async function () {
      setIsLoading(true);
      const response = await apiGetNewsByDate({
        reqQuery: {
          limit: MAX_DATA_DISPLAY,
          offset: 0,
        }
      });

      if (isMounted && response.status === RESPONSE_SUCCESS) {
        setNewsArrayData(response.data);
      }

      if (isMounted) setIsLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const featured = newsArrayData[0];
  const secondaryNews = useMemo(() => newsArrayData.slice(1, 4), [newsArrayData]);
  const openNews = (item?: NewsItem) => {
    if (!item?.slug) return;
    router.push(`/${item.slug}`);
  };

  return (
    <section id="activity-and-news">
      <Container maxWidth={customMaxWidthContainer()}>
        <div className="section-heading">
          <div>
            <span>Tin mới</span>
            <h2>{title}</h2>
          </div>
          <button onClick={() => router.push("/tin-tuc/tat-ca-tin-tuc")}>Xem tất cả</button>
        </div>

        {isLoading && (
          <Grid container spacing={2.5} className="news-grid">
            <Grid item xs={12} md={6}>
              <div className="news-card news-card-featured news-card-loading">
                <div className="news-card-image" />
                <div className="news-card-content">
                  <span />
                  <h3 />
                  <p />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2.5} className="news-secondary-list">
                {[0, 1, 2].map((item) => (
                  <Grid item xs={12} key={item}>
                    <div className="news-card news-card-compact news-card-loading">
                      <div className="news-card-image" />
                      <div className="news-card-content">
                        <span />
                        <h3 />
                        <p />
                      </div>
                    </div>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        )}

        {!isLoading && newsArrayData.length > 0 && (
          <Grid container spacing={2.5} className="news-grid">
            {featured && (
              <Grid item xs={12} md={6}>
                <NewsCard item={featured} featured onOpen={openNews} />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <Grid container spacing={2.5} className="news-secondary-list">
                {secondaryNews.slice(0, 4).map((item) => (
                  <Grid item xs={12} key={item._id || item.slug}>
                    <NewsCard item={item} onOpen={openNews} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        )}

        {!isLoading && newsArrayData.length === 0 && (
          <div className="news-empty-state">Tin tức đang được cập nhật, vui lòng thử lại sau ít phút.</div>
        )}
      </Container>
    </section>
  );
}

export default News;
