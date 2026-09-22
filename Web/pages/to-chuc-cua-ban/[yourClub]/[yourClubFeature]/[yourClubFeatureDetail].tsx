import React from 'react';
import { META_ROBOT_INDEX_FOLLOW } from '../../../../modules/share/constraint';
import usePageAuth from '../../../../hooks/usePageAuth';
import { useRouter } from 'next/router';
import Layout from '../../../../features/common/Layout';
import { getWebSEOProps } from '../../../../utils/getSEOProps';
import { wrapper } from '../../../../app/store';
import { apiGetClubFeatureChildByClubSlug, apiGetClubFeatureDetailBySlug, apiGetMemberFeatureDetail } from '../../../../utils/api/clubFeatureApi';
import { RESPONSE_SUCCESS, STATUS_PUBLIC } from '../../../../utils/constraint';
import ClubFeatureDetail from '../../../../models/ClubFeatureDetail';
import NewFeaturePageView from '../../../../components/clubFeature/new-feature-page-view';
import EventFeaturePageView from '../../../../components/clubFeature/event-feature-page-view';
import { apiGetClubBySlug } from '../../../../utils/api/clubsApi';
import Club from '../../../../models/clubsModel';
import ClubFeatureChild from '../../../../models/ClubFeatureChild';
import DocFeaturePageView from '../../../../components/clubFeature/doc-feature-page-view';
import { setPublicPageCache } from '../../../../utils/pageCache';

function YourClubFeatureDetail({ club, featureSlug, featureId, featureDetail, featureCategories, membersEvent }: { club: Club, featureSlug: string, featureId: string, featureDetail: ClubFeatureDetail, featureCategories: Array<ClubFeatureChild>, membersEvent: any }) {
    usePageAuth();
    const router = useRouter();

    const renderView = () => {
        const contentViewRender = () => {
            switch (featureDetail?.contentType) {
                case 1:
                    return <NewFeaturePageView featureDetail={featureDetail} club={club} featureSlug={featureSlug} featureId={featureId} featureCategories={featureCategories} />;
                case 2:
                    return <DocFeaturePageView featureDetail={featureDetail} club={club} featureSlug={featureSlug} featureId={featureId} featureCategories={featureCategories} />;
                case 3:
                    return <EventFeaturePageView featureDetail={featureDetail} club={club} featureSlug={featureSlug} featureId={featureId} featureCategories={featureCategories} membersEvent={membersEvent} />;
                default:
                    return <div>Unknown content type</div>;
            }
        }

        return (
            <Layout
                {...getWebSEOProps({
                    seoTitle: 'Tổ chức của bạn - Hội Sinh viên Đại học Bách khoa Hà Nội',
                    descriptionSeo: 'Tổ chức của bạn - Hội Sinh viên Đại học Bách khoa Hà Nội',
                    metaRobot: META_ROBOT_INDEX_FOLLOW,
                    slug: router?.asPath ?? ''
                })}
            >
                {contentViewRender()}
            </Layout>
        );
    };

    return renderView();
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    setPublicPageCache(context.res);
    const clubSlug = context.query.yourClub as string;
    const featureSlug = context.query.yourClubFeature as string;
    const featureDetailSlug = context.query.yourClubFeatureDetail as string;
    const featureSlugArr = featureSlug?.split('-');

    const [featureCateRes, featureDetailRes, clubRes] = await Promise.all([
        apiGetClubFeatureChildByClubSlug({
            slug: clubSlug ? clubSlug : '',
            status: STATUS_PUBLIC
        }),
        apiGetClubFeatureDetailBySlug({
            slug: featureDetailSlug ?? "",
            featureId: featureSlugArr[featureSlugArr.length - 1]
        }),
        apiGetClubBySlug({
            reqQuery: {
                slug: clubSlug
            }
        })
    ]);

    let membersEventRes
    if (featureDetailRes?.data.contentType === 3) {
        membersEventRes = await apiGetMemberFeatureDetail({
            featureDetailId: featureDetailRes?.data._id,
            offset: 0,
            limit: 100
        })
    }

    if (featureDetailRes.status === RESPONSE_SUCCESS && clubRes?.status === RESPONSE_SUCCESS) {
        return {
            props: {
                club: clubRes.data,
                featureSlug: featureSlug ?? "",
                featureId: featureSlugArr[featureSlugArr.length - 1] ?? "",
                featureDetail: featureDetailRes.data,
                featureCategories: featureCateRes.data,
                membersEvent: membersEventRes?.data ?? {}
            }
        }
    } else {
        return {
            props: {
                featureSlug: featureSlug ?? "",
                featureId: featureSlugArr[featureSlugArr.length - 1] ?? "",
            }
        }
    }
})

export default YourClubFeatureDetail;
