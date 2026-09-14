import { Breadcrumbs, Container, Grid, Link, useMediaQuery, useTheme } from "@mui/material";
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import NextLink from "../../components/NextLink";
import { Course } from "../../modules/share/model/courses";
import { apiGetCoursesByCategorySlug } from "../../utils/api/courseApi";
import { apiGetPathBySlugs } from "../../utils/api/topicApi";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import './style.scss';
import customMaxWidthContainer from "../../features/common/CustomMaxWidth";
const CategoryView = (props: { stateSlug: string, dataCourses: Course[]; title?: string, description?: string }) => {
  const { stateSlug, dataCourses, title, description } = props;

  //const router = useRouter();
  //const [dataCourses, setDataCourses] = useState<Course[]>([]);
  const [path, setPath] = useState<Array<{ label: string, slug: string }>>([]);

  useEffect(() => {
    const onFetchPath = async () => {
      const path = await apiGetPathBySlugs({ slugs: [stateSlug] });
      if (path)
        setPath(path);
    }
    onFetchPath();
  }, [stateSlug]);

  const theme = useTheme()
  const isLgDesktopUI = useMediaQuery(theme.breakpoints.down('xxl'))
  return (
    <Container maxWidth={customMaxWidthContainer()}>
      <div className="grade-page-panel">
        <BreadCrumb path={path} />
        <div className="title-topic">
          <h1 className="title-h1">{title}</h1>
          <div className="summary" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
        <Grid container spacing={2}>
          {dataCourses?.map(course => (
            <Grid key={course._id} xs={6} sm={4} item md={3}>
              <div className="item-category-grade">
                <NextLink href={`${stateSlug}/${course.slug}`}>
                  <div className="item-category-grade-image">
                    <Image src={course?.avatar ? course?.avatar : '/images/avatar.png'} width={isLgDesktopUI ? 200 : 269} height={isLgDesktopUI ? 117 : 158} layout="responsive" objectFit="cover" />
                  </div>
                  <div className="infor-course">
                    <div className="title-category-grade dot-1">{course.name}</div>
                    <p className="des-category-grade dot-4">{course.shortDesc}</p>
                    <div className="practice-now">
                      <button>
                        <span style={{ lineHeight: '24px', fontSize: isLgDesktopUI ? '12px' : '14px' }}>Làm ngay</span>
                        <ChevronRightIcon />
                      </button>
                    </div>
                  </div>
                  {/* <div className="des-category-grade">{course.shortDesc ?? ''}</div> */}
                </NextLink>
              </div>
            </Grid>
          ))
          }
        </Grid >
      </div >
    </Container >
  )
}

export default CategoryView;