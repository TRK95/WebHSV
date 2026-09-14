import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import NewsCategory from "../../../models/newsCategoryModel";
import NewsModel from "../../../models/newsModel";
import { apiGetNewsBySlug, apiGetNewsCategories } from "../../../utils/api/newsApi";
import BreadCrumb from '../../breadcrumb/BreadCrumb';
import { Document as PDFDocument, Page as PDFPage } from "react-pdf";
import "./style.scss";

const RESPONSE_SUCCESS = 0
const STATUS_PUBLIC = 1

function DetailDocument({ slug }: { slug: Array<string> }) {
  const [documentCategories, setDocumentCategories] = useState<Array<NewsCategory>>([]);
  const [filterDocumentCate, setFilterDocumentCate] = useState<NewsCategory>(null);
  const [detailDoc, setDetailDoc] = useState<NewsModel>(null);

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
      documentCategories?.find((item) => item.slug === slug[0])
    );
  }, [slug, documentCategories]);

  useEffect(() => {
    (async () => {
      const docBySlugRes = await apiGetNewsBySlug({
        reqQuery: {
          slug: slug[1],
        }
      });
      if (docBySlugRes.status === RESPONSE_SUCCESS) {
        setDetailDoc(docBySlugRes.data);
      }
    })();
  }, [slug[1]]);

  return (
    <>
      <div id="detail-document">
        <Container maxWidth='xl'>
          {detailDoc && filterDocumentCate && (
            <>
              <BreadCrumb
                path={[
                  {
                    label: filterDocumentCate?.title,
                    slug: `tai-lieu/${filterDocumentCate.slug}`,
                  },
                  {
                    label: detailDoc.title,
                    slug: `tai-lieu/${filterDocumentCate.slug}/${detailDoc.slug}`,
                  },
                ]}
              />
              <div className="detail-document-body">
                <div
                  className="detail-document-body-description"
                  dangerouslySetInnerHTML={{ __html: detailDoc?.content }}
                />

                {detailDoc?.docUrl.includes(".pdf") ? (
                  <embed
                    src={detailDoc?.docUrl}
                  />
                ) : (
                  <a href={detailDoc?.docUrl} target="_blank">
                    {detailDoc?.title}
                  </a>
                )}
              </div>
            </>
          )}
        </Container>
      </div>
    </>
  );
}

export default DetailDocument;
