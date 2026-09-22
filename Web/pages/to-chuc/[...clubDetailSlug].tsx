import { wrapper } from "../../app/store";
import DetailClubPageView from "../../components/club/detail-club-page-view";
import NetWorkClubPageView from "../../components/club/network-club-page-view";
import Layout from "../../features/common/Layout";
import usePageAuth from "../../hooks/usePageAuth";
import ClubCategory from "../../models/clubsCategoryModel";
import Club from "../../models/clubsModel";
import { apiGetMemberClubs } from "../../utils/api/clubMembersApi";
import { apiGetClubBySlug, apiGetClubCategories } from "../../utils/api/clubsApi";
import { CLUB_TYPE, DOMAIN_ID_ALUMNI, RESPONSE_SUCCESS } from "../../utils/constraint";
import 'antd/dist/antd.css';
import { getWebSEOProps } from "../../utils/getSEOProps";
import { useRouter } from "next/router";
import { META_ROBOT_INDEX_FOLLOW } from "../../modules/share/constraint";
import { setPublicPageCache } from "../../utils/pageCache";

function ClubDetailSlugPage({ slugs, clubCategories, clubDetail, memberClubs }: {
    slugs: string[],
    clubCategories: ClubCategory[],
    clubDetail: Club,
    memberClubs: any
}) {
    const router = useRouter();

    usePageAuth()
    const renderView = () => {
        switch (slugs?.length) {
            case 1: {
                return <Layout
                    {...getWebSEOProps({
                        seoTitle: 'Kết nối Cựu SV - Hội Sinh viên Đại học Bách khoa Hà Nội',
                        descriptionSeo: 'Kết nối Cựu SV - Hội Sinh viên Đại học Bách khoa Hà Nội',
                        metaRobot: META_ROBOT_INDEX_FOLLOW,
                        slug: router?.asPath ?? ''
                    })}
                >
                    <NetWorkClubPageView slugs={slugs} clubCategories={clubCategories} />
                </Layout>
            } case 2: {
                return <Layout
                    {...getWebSEOProps({
                        seoTitle: clubDetail?.name ?? '',
                        descriptionSeo: clubDetail?.name ?? '',
                        metaRobot: META_ROBOT_INDEX_FOLLOW,
                        slug: router?.asPath ?? ''
                    })}
                >
                    <DetailClubPageView clubDetail={clubDetail} slugs={slugs} memberClubs={memberClubs} />
                </Layout>
            }
        }
    }
    return renderView()
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    setPublicPageCache(context.res);
    const slugs = context.query?.clubDetailSlug as string[]

    const clubCategoriesRes = await apiGetClubCategories({
        reqQuery: {
            parentId: -1,
            type: CLUB_TYPE
        }
    })

    if (slugs?.length === 1) {
        return {
            props: {
                slugs: slugs ?? [],
                clubCategories: clubCategoriesRes.status === RESPONSE_SUCCESS ? clubCategoriesRes.data : [],
                clubDetail: null,
                memberClubs: [],
            }
        };
    }

    const detailClubRes = await apiGetClubBySlug({
        reqQuery: {
            slug: slugs?.[slugs.length - 1] ?? ''
        }
    });

    const memberClubsRes = detailClubRes.status === RESPONSE_SUCCESS
        ? await apiGetMemberClubs({
            reqQuery: {
                limit: 100,
                offset: 0,
                clubId: detailClubRes?.data?._id ?? ''
            }
        })
        : null;

    return {
        props: {
            slugs: slugs ?? [],
            clubCategories: clubCategoriesRes.status === RESPONSE_SUCCESS ? clubCategoriesRes.data : [],
            clubDetail: detailClubRes.status === RESPONSE_SUCCESS ? detailClubRes.data : null,
            memberClubs: memberClubsRes?.status === RESPONSE_SUCCESS ? memberClubsRes.data ?? [] : [],
        }
    };
})

export default ClubDetailSlugPage;
