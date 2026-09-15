import React, { useEffect, useState } from 'react';
import './style.scss'
import {
    CreditCardOutlined,
    FileImageOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Image, Space, Button } from 'antd';
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { Link, useHistory, useLocation } from 'react-router-dom';
import { IconNews } from '@/assets/icon/news';
import { IconEvent } from '@/assets/icon/event';
import { IconFeedback } from '@/assets/icon/feedback';
import { IconService } from '@/assets/icon/service';
import { IconClub } from '@/assets/icon/club';
import { IconSv5t } from '@/assets/icon/sv5t';
import { IconIntroduce } from '@/assets/icon/introduction';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/redux/reducer';
import ClubMember from '@/models/ClubMember';
import { fetchPresidentByToken } from '@/redux/reducer/userInfoSlice';
import { loadClubFeatureChild } from '@/redux/reducer/clubFeatureChildSlice';

const { Header, Sider, Content } = Layout;

const DefaultLayout = ({ children }: { children?: React.ReactNode }) => {
    const location = useLocation();
    const dispatch = useDispatch()
    const isAdminSession = !!window.localStorage.getItem("admin")
    const presidentToken = isAdminSession ? null : window.localStorage.getItem("presidentToken")
    const [currentPresident, setCurrentPresident] = useState<any>()
    const { userInfo } = useSelector((state: AppState) => state.userInfoReducer)
    const { clubFeatureChilds } = useSelector((state: AppState) => state.clubFeatureChildsReducer)
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([""]);
    const [isOpenPreviewImg, setIsOpenPreviewImg] = useState(false);
    const [current, setCurrent] = useState(
        location.pathname === '/' || location.pathname === "" ? "/" : location.pathname
    )
    useEffect(() => {
        const userInfoStr = localStorage.getItem("presidentInfo")
        if (userInfoStr !== null)
            setCurrentPresident(JSON.parse(userInfoStr))
        if (presidentToken)
            dispatch(fetchPresidentByToken(presidentToken));
    }, [presidentToken])

    useEffect(() => {
        if (userInfo?.clubId)
            dispatch(loadClubFeatureChild({ parentId: String(userInfo.clubId), status: 1 }));
    }, [userInfo, dispatch])
    // const [current, setCurrent] = useState(location.pathname)

    const handleLogout = () => {
        localStorage.clear()
        // window.location.href = '/login'
        window.location.href = process.env.PATH_NAME ?? '/'
    }

    const menuActionsUser = (
        <Menu>
            <Menu.Item>Đăng nhập</Menu.Item>
            <Menu.Item>Đăng xuất</Menu.Item>
        </Menu>
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <Space size='small' className='logo'>
                    <div
                        style={{
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            setIsOpenPreviewImg(true)
                        }}
                    >
                        <Avatar size={50} src='https://storage.cloud.google.com/fir-frontend-c727b.appspot.com/images/huy-hieu-hoi.png?authuser=1' />
                    </div>
                    {!collapsed && <Space direction='vertical' style={{ color: '#fff' }}>
                        <div className="name">{currentPresident?.fullName || "ADMIN"}</div>
                        {/* <div className="name">ADMIN</div> */}
                        <Button type='primary'
                            onClick={handleLogout}
                        >Logout</Button>
                    </Space>}
                </Space>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[current]}
                    selectedKeys={[current]}
                    onClick={(e) => {
                        setCurrent(e.key)
                    }}
                    defaultOpenKeys={['tochuc']}

                >
                    {
                        !presidentToken
                            ? (
                                <>
                                    <Menu.SubMenu key={'tochuc'} level={1} icon={<div className='iconLayout'><IconClub /></div>} title="Tổ chức">
                                        <Menu.Item key={'/danh-muc-to-chuc'}><Link to={'/danh-muc-to-chuc'}>Danh mục</Link></Menu.Item>
                                        <Menu.Item key={'to-chuc'}><Link to={'to-chuc'}>Thông tin tổ chức</Link></Menu.Item>
                                    </Menu.SubMenu>
                                    <Menu.SubMenu key={'gioithieu'} level={1} icon={<div className='iconLayout'><IconIntroduce /></div>} title="Giới thiệu">
                                        <Menu.Item key={'/danh-muc-gioi-thieu'}><Link to={'/danh-muc-gioi-thieu'}>Danh mục</Link></Menu.Item>
                                        <Menu.Item key={'/gioi-thieu'}><Link to={'/gioi-thieu'}>Nội dung chi tiết</Link></Menu.Item>
                                    </Menu.SubMenu>
                                    <Menu.SubMenu key={'tintuc'} level={1} icon={<div className='iconLayout'><IconNews /></div>} title="Tin tức">
                                        <Menu.Item key={'/danh-muc-tin-tuc'}><Link to={'/danh-muc-tin-tuc'}>Danh mục</Link></Menu.Item>
                                        <Menu.Item key={'/tin-tuc'}><Link to={'/tin-tuc'}>Nội dung tin tức</Link></Menu.Item>
                                    </Menu.SubMenu>
                                    <Menu.SubMenu key={'vanban'} level={1} icon={<div className='iconLayout'><IconService /></div>} title="Văn bản">
                                        <Menu.Item key={'/danh-muc-van-ban'}><Link to={'/danh-muc-van-ban'}>Danh mục</Link></Menu.Item>
                                        <Menu.Item key={'/van-ban'}><Link to={'/van-ban'}>Nội dung văn bản</Link></Menu.Item>
                                    </Menu.SubMenu>
                                    <Menu.SubMenu key={'sv5t'} level={1} icon={<div className='iconLayout'><IconSv5t /></div>} title="Sv5t">
                                        <Menu.Item key={'/danh-muc-sv5t'}><Link to={'/danh-muc-sv5t'}>Danh mục</Link></Menu.Item>
                                        <Menu.Item key={'/sv5t'}><Link to={'/sv5t'}>Nội dung chi tiết</Link></Menu.Item>
                                        <Menu.Item key={'/sv5t-ho-so'}><Link to={'/sv5t-ho-so'}>Hồ sơ & xét duyệt</Link></Menu.Item>
                                    </Menu.SubMenu>
                                    <Menu.Item key={'/su-kien'} icon={<div className='iconLayout'><IconEvent /></div>}><Link to={'/su-kien'}>Sự kiện</Link></Menu.Item>
                                    {/* <Menu.Item key='/phan-hoi' icon={<div className='iconLayout'><IconFeedback /></div>}><Link to={"/phan-hoi"}>Phản hồi</Link></Menu.Item>
                                    <Menu.Item key='/albums' icon={<div className='iconLayout'><FileImageOutlined /></div>}><Link to={"/albums"}>Albums</Link></Menu.Item> */}
                                </>
                            )
                            : (
                                <>
                                    <Menu.Item key={'/to-chuc'} icon={<div className='iconLayout'><IconClub /></div>}><Link to={'/to-chuc'}>Thông tin tổ chức</Link></Menu.Item>
                                    {
                                        clubFeatureChilds?.map((clubFeatureChild, index) => (
                                            <Menu.Item key={clubFeatureChild?._id}
                                                icon={<div className='iconLayout'>
                                                    {
                                                        clubFeatureChild?.type === 1 ? <IconNews /> : clubFeatureChild?.type === 2 ? <IconService /> : <IconEvent />
                                                    }
                                                </div>}>
                                                <Link to={`/danh-muc#${clubFeatureChild?.slug}`}>{clubFeatureChild?.title}</Link>
                                            </Menu.Item>
                                        ))
                                    }
                                </>
                            )
                    }
                </Menu>
            </Sider>
            <Layout className="site-layout">
                {/* <Header className="site-layout-background" style={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '24px' }}>
                    <Dropdown placement="bottomRight" arrow overlay={menuActionsUser}>
                        <Avatar style={{ cursor: 'pointer' }} size="large" icon={<UserOutlined />} />
                    </Dropdown>
                </Header> */}
                <Content>
                    <div style={{
                        margin: '16px',
                        backgroundColor: "#fff",
                        padding: 16,
                        minHeight: 'calc(100vh - 32px)',
                        maxHeight: 'calc(100vh - 32px)',
                        overflowY: 'auto',
                    }}>
                        {children}
                    </div>
                </Content>
            </Layout>
            {
                isOpenPreviewImg && <Image
                    width={0}
                    style={{ display: 'none', position: 'fixed' }}
                    src={'https://storage.cloud.google.com/fir-frontend-c727b.appspot.com/images/huy-hieu-hoi.png?authuser=1'}
                    preview={{
                        visible: isOpenPreviewImg,
                        src: 'https://storage.cloud.google.com/fir-frontend-c727b.appspot.com/images/huy-hieu-hoi.png?authuser=1',
                        onVisibleChange: value => {
                            setIsOpenPreviewImg(value);
                        },
                    }}
                />
            }
        </Layout >
    );
};

export default DefaultLayout;
