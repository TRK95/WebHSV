import { apiGetClubFeatureChildBySlug } from '@/api/clubFeatureApi'
import ClubFeatureDetail from '@/components/ClubFeatureDetail'
import ClubFeatureChild from '@/models/ClubFeatureChild'
import { AppState } from '@/redux/reducer'
import { RESPONSE_SUCCESS } from '@/utils/contrants'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'

function ClubFeaturePage() {
    const params = useLocation();
    const { userInfo } = useSelector((state: AppState) => state.userInfoReducer);
    const [curClubFeature, setCurClubFeature] = useState<ClubFeatureChild>();

    useEffect(() => {
        const fetchClubFeature = async () => {
            if (userInfo?.clubId && params) {
                const data = await apiGetClubFeatureChildBySlug({
                    parentId: userInfo.clubId as string,
                    slug: params.hash.slice(1),
                });
                setCurClubFeature(data.data);
            }
        };

        fetchClubFeature();
    }, [userInfo, params]);

    return (
        <div>
            {
                curClubFeature && <ClubFeatureDetail feature={curClubFeature} />
            }
        </div>
    );
};

export default ClubFeaturePage