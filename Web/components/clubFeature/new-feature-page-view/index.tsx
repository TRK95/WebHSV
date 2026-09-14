import { Container } from "@mui/system";
import customMaxWidthContainer from "../../../features/common/CustomMaxWidth";
import NewsModel from "../../../models/newsModel";
import moment from "moment";
import './style.scss'
import BreadCrumb from "../../breadcrumb/BreadCrumb";
import { STATUS_PUBLIC } from "../../../utils/constraint";
import { useEffect } from 'react'
import { useDispatch, useSelector } from "../../../app/hooks";
import _ from "lodash";
import { fetchNewsCategory } from "../../../app/redux/reducers/newsCategorySlice";
import NewsInCategory from "../../../models/newsIncategory";
import ClubFeatureDetail from "../../../models/ClubFeatureDetail";
import Club from "../../../models/clubsModel";
import ClubFeatureChild from "../../../models/ClubFeatureChild";

export type News = NewsModel & {
    key?: React.Key,
    inCategories?: Array<NewsInCategory>
}

function NewFeaturePageView({ featureDetail, club, featureSlug, featureId, featureCategories }: { featureDetail: ClubFeatureDetail, club: Club, featureSlug?: string, featureId?: string, featureCategories: Array<ClubFeatureChild> }) {
    const paths = [
        { label: club && `${club?.name}`, slug: `to-chuc-cua-ban/${club?.slug}/${featureCategories[0]?.slug}-${featureCategories[0]?._id}` },
        { label: featureCategories?.filter(item => item._id === featureId)[0]?.title, slug: `to-chuc-cua-ban/${club?.slug}/${featureSlug}` },
        { label: featureDetail.title, slug: `to-chuc-cua-ban/${club?.slug}/${featureSlug}/${featureDetail?.slug}` }
    ]

    return (<div id='detail-news-page-view' style={{ padding: '20px 0', color: 'var(--textColor)' }}>
        <Container maxWidth={customMaxWidthContainer()}>
            <BreadCrumb path={paths} />
            {featureDetail ? <div className="detail-news-page-view-content">
                <div className="detail-news-page-view-header">
                    <h2 className="detail-news-header-title" style={{ marginBottom: '8px' }}>
                        {featureDetail?.title ?? 'Không có tiêu đề'}
                    </h2>
                    <i className="detail-news-header-date" style={{ color: 'var(--primary-color-main)' }}>
                        {`Ngày: ${moment(featureDetail?.createDate).format('DD/MM/YYYY')}`}
                    </i>
                </div>
                {featureDetail?.content
                    ? <div className="detail-news-page-view-body" dangerouslySetInnerHTML={{ __html: featureDetail?.content }}>
                    </div>
                    : <div className="detail-news-page-view-body">
                        <p>Không có dữ liệu</p>
                    </div>
                }
            </div>
                : <h3>
                    Không có dữ liệu
                </h3>
            }
        </Container>
    </div>
    );
}

export default NewFeaturePageView;