import React from 'react'
import { META_ROBOT_INDEX_FOLLOW } from '../../../../modules/share/constraint';
import usePageAuth from '../../../../hooks/usePageAuth';
import { useRouter } from 'next/router';
import Layout from '../../../../features/common/Layout';
import { getWebSEOProps } from '../../../../utils/getSEOProps';
import { wrapper } from '../../../../app/store';
import { apiGetClubFeatureChildByClubSlug } from '../../../../utils/api/clubFeatureApi';
import { RESPONSE_SUCCESS, STATUS_PUBLIC } from '../../../../utils/constraint';
import ClubFeatureChild from '../../../../models/ClubFeatureChild';
import FeaturePageView from '../../../../components/clubFeature/clubFeature-page-view';

function YourClubFeature({ clubSlug, featureSlug, featureId, featureCategories, page }: { clubSlug: string, featureSlug: string, featureId: string, featureCategories: Array<ClubFeatureChild>, page: Number }) {
    usePageAuth()
    const router = useRouter();
    const renderView = () => {
        return (
            <Layout
                {...getWebSEOProps({
                    seoTitle: 'Tổ chức của bạn - Hội Sinh viên Đại học Bách khoa Hà Nội',
                    descriptionSeo: 'Tổ chức của bạn - Hội Sinh viên Đại học Bách khoa Hà Nội',
                    metaRobot: META_ROBOT_INDEX_FOLLOW,
                    slug: router?.asPath ?? ''
                })}
            >
                <FeaturePageView clubSlug={clubSlug} featureSlug={featureSlug} featureId={featureId} featureCategories={featureCategories} pageQuery={page} />
            </Layout>
        );
    }
    return renderView()
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    const clubSlug = context.query.yourClub as string
    const featureSlug = context.query.yourClubFeature as string
    const featureSlugArr = featureSlug?.split('-')
    const page = context.query?.page

    const featureCateRes = await apiGetClubFeatureChildByClubSlug({
        slug: clubSlug ? clubSlug : '',
        status: STATUS_PUBLIC
    })

    if (featureCateRes.status === RESPONSE_SUCCESS) {
        return {
            props: {
                clubSlug: clubSlug ?? "",
                featureSlug: featureSlug ?? "",
                featureId: featureSlugArr[featureSlugArr.length - 1] ?? "",
                featureCategories: featureCateRes.data,
                page: page ?? 1
            }
        }
    } else {
        return {
            props: {
                clubSlug: clubSlug ?? "",
                featureSlug: featureSlug ?? "",
                featureId: featureSlugArr[featureSlugArr.length - 1] ?? "",
                page: page ?? 1
            }
        }
    }
})

export default YourClubFeature