import dynamic from "next/dynamic";
import { wrapper } from "../../app/store";
import DocumentPageView from "../../components/document/DocumentPageView";
import Layout from "../../features/common/Layout";
import { setPublicPageCache } from "../../utils/pageCache";

const DetailDocument = dynamic(() => import("../../components/document/DetailDocument"), { ssr: false });

function DetailDocumentPage({ slugs }: { slugs?: Array<string> }) {

    const renderView = () => {
        switch (slugs?.length) {
            case 1: {
                return <DocumentPageView slug={slugs[0]} />
            }
            case 2: {
                return <DetailDocument slug={slugs} />
            }
        }
    }
    return (
        <Layout>
            {renderView()}
        </Layout>
    );
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    setPublicPageCache(context.res);
    const slugs = context.query?.detailDocumentSlug as string[]

    return {
        props: {
            slugs: slugs
        }
    }
})

export default DetailDocumentPage;
