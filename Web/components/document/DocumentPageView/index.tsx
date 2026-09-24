import ChevronRight from "@mui/icons-material/ChevronRight";
import { Container, Grid } from "@mui/material";
import { sortBy } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NewsCategory from "../../../models/newsCategoryModel";
import NewsInCategory from "../../../models/newsIncategory";
import { apiGetNewsCategories, apiGetNewsInCategory } from "../../../utils/api/newsApi";
import BreadCrumb from '../../breadcrumb/BreadCrumb';
import NextLink from "../../NextLink";
import ContentSidebar from "../../common/ContentSidebar";

import "./style.scss";
import SkeletonView from "./skeleton";

const RESPONSE_SUCCESS = 0
const STATUS_PUBLIC = 1

function DocumentPageView({ slug }: { slug: string }) {
  const [documentCategories, setDocumentCategories] = useState<Array<NewsCategory>>([]);
  const [loading, setLoading] = useState(true);
  const [documentList, setDocumentList] = useState<Array<NewsInCategory>>([]);
  const [filterDocumentCate, setFilterDocumentCate] = useState<NewsCategory>(null);
  const router = useRouter();
  const routeSlugs = router.query.detailDocumentSlug;
  const currentSlug = Array.isArray(routeSlugs) ? routeSlugs[0] : slug;

  const handleClickCate = (item: NewsCategory) => {
    setLoading(true);
    router.push(`/tai-lieu/${item.slug}`, undefined, { shallow: true, scroll: false });
  };

  useEffect(() => {
    const fetchDocumentCategories = async () => {
      const documentCategories = await apiGetNewsCategories({
        reqQuery: {
          parentId: "-1",
          type: 3,
          status: STATUS_PUBLIC,
        }
      });
      setDocumentCategories(documentCategories.data ?? [])
    }
    fetchDocumentCategories()
  }, [])

  useEffect(() => {
    setFilterDocumentCate(
      documentCategories?.find((item) => item.slug === currentSlug)
    );
  }, [currentSlug, documentCategories]);

  useEffect(() => {
    const getListData = async () => {
      const res = await apiGetNewsInCategory({
        reqQuery: {
          offset: 0,
          limit: 50,
          status: STATUS_PUBLIC,
          categoryId: filterDocumentCate._id,
        },
      });
      if (res.status === RESPONSE_SUCCESS) {
        setDocumentList(res.data);
      }
    };

    if (filterDocumentCate?._id) {
      getListData();
    }
  }, [filterDocumentCate?._id]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [filterDocumentCate?._id]);

  return (
    <div id="document-page-view">
      <Container maxWidth='xl'>
        <BreadCrumb path={[{ label: "Tài liệu", slug: `tai-lieu/${documentCategories[0]?.slug}` }, { label: `${filterDocumentCate?.title}`, slug: `tai-lieu/${filterDocumentCate?.slug}` }]} />
        {
          <div>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4} md={3}>
                <ContentSidebar
                  items={sortBy(documentCategories, ["createDate"]).map((item) => ({
                    key: item._id || item.slug,
                    label: item.title,
                    active: currentSlug === item.slug,
                    onClick: () => handleClickCate(item),
                  }))}
                />
              </Grid>
              <Grid item xs={12} sm={8} md={9}>
                <div className="document-page-view-body">
                  <div className="document-page-view-body-title">
                    {filterDocumentCate?.title}
                  </div>
                  {loading ? (
                    <SkeletonView />
                  ) : (
                    <ul style={{ paddingLeft: "0px", listStyleType: "none" }}>
                      {documentList?.length > 0 ? (
                        <>
                          {documentList.map((item) => (
                            <li
                              style={{
                                display: "flex",
                                alignItems: "center",
                                textDecoration: "none",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  background: "#1788CA",
                                  borderRadius: "50%",
                                  marginRight: "5px",
                                }}
                              >
                                <ChevronRight
                                  sx={{
                                    color: "white",
                                    fontSize: "16px",
                                    fontWeight: 600,
                                  }}
                                />
                              </div>
                              {/* {
                                item?.news?.docUrl.includes("pdf") ?
                                  <NextLink href={`/tai-lieu/${filterDocumentCate.slug}/${item?.news?.slug}`}>{item.news.title}</NextLink> :
                                  <a href={item?.news?.docUrl} target="_blank" style={{ textDecoration: "none", color: "inherit" }}>{item.news.title}</a>
                              } */}
                              <a href={item?.news?.docUrl} target="_blank" style={{ textDecoration: "none", color: "inherit" }}>{item.news.title}</a>
                            </li>
                          ))}
                        </>
                      ) : (
                        <h3 style={{ textAlign: "center" }}>
                          Không có dữ liệu
                        </h3>
                      )}
                    </ul>
                  )}
                </div>
              </Grid>
            </Grid>
          </div>
        }
      </Container>
    </div>
  );
}

export default DocumentPageView;
