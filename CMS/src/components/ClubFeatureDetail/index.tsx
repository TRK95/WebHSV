import React from 'react'
import ClubFeatureNews from './ClubFeatureNews';
import ClubFeatureDoc from './ClubFeatureDoc';
import ClubFeatureEvent from './ClubFeatureEvent';
import ClubFeatureChild from '@/models/ClubFeatureChild';

function ClubFeatureDetail(props: { feature?: ClubFeatureChild }) {
    const { feature } = props

    const renderView = () => {
        switch (feature?.type) {
            case 1:
                return <ClubFeatureNews feature={feature} />
            case 2:
                return <ClubFeatureDoc feature={feature} />
            case 3:
                return <ClubFeatureEvent feature={feature} />
            default:
                return "Thư mục không có trong cơ sở dữ liệu"
        }
    }
    return (
        <div>{renderView()}</div>
    )
}

export default ClubFeatureDetail