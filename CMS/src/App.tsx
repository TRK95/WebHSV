
import DefaultLayout from "./components/layouts/DefaultLayout";
import { BrowserRouter as Router, Redirect, Route, Switch, useHistory } from 'react-router-dom'
import NewsPage from "./pages/newsPage";
import EventsPage from "./pages/eventsPage";
import CategoryNewsPage from "./pages/categoryNewsPage";
import { PrivateRoute } from "./components/Routes/PrivateRoute";
import LoginComponent from "./components/Login";
import "@/assets/style/index.scss"
import DocumentPage from "./pages/documnentPage";
import CategoryDocument from "./components/documenPageView/CategoryDocument";
import IntroducePage from "./pages/introducePage";
import CategoryIntroduce from "./components/IntroducePageView/CategoryIntroduce";
import CategoryClubs from "./pages/categoryClubs";
import Clubs from "./pages/clubs";
import Sv5tPage from "./pages/Sv5tPage";
import CategorySv5t from "./components/Sv5tPageView/CategorySv5t";
import usePageAuth from "./hook/usePageAuth";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "./redux/reducer";
import { useEffect } from "react";
import ClubFeaturePage from "./pages/ClubFeaturePage";
import Sv5tApplicationPage from "./pages/Sv5tApplicationPage";

function App() {
    const sessionId = localStorage.getItem("sessionId")
    const isAdminSession = !!localStorage.getItem("admin")
    const presidentToken = isAdminSession ? null : localStorage.getItem("presidentToken")
    // usePageAuth()
    const { token, userInfo } = useSelector((state: AppState) => state.userInfoReducer);

    useEffect(() => {
        if (!isAdminSession && userInfo && !!token) {
            const presidentInfo = {
                userId: userInfo.student.userId,
                fullName: userInfo.student.fullName,
                email: userInfo.student.email,
            };
            localStorage.setItem('sessionId', 'A2299F8F-386E-476C-AA1C-42227C54F478-1672740676352_1672740676352');
            localStorage.setItem('presidentInfo', JSON.stringify(presidentInfo));
            localStorage.setItem('presidentToken', token);
        }
    }, [userInfo, token]);

    return (
        <Router basename={process.env.NODE_ENV === "production" ? process.env.PATH_NAME ?? "/" : "/"}>
            <div id="app">
                {/* handle routing in here */}
                <Switch>
                    {!sessionId && (
                        <Route path="/login" component={LoginComponent} />
                    )}
                    <Route path="/">
                        {
                            sessionId ? (
                                <DefaultLayout>
                                    <Switch >
                                        <PrivateRoute path="/to-chuc" component={Clubs} />
                                        <PrivateRoute path="/to-muc" component={Clubs} />
                                        <PrivateRoute path="/danh-muc" component={ClubFeaturePage} />
                                        {!presidentToken && <>
                                            <PrivateRoute path="/van-ban" component={DocumentPage} />
                                            <PrivateRoute path="/gioi-thieu" component={IntroducePage} />
                                            <PrivateRoute path="/su-kien" component={EventsPage} />
                                            <PrivateRoute path="/tin-tuc" component={NewsPage} />
                                            <PrivateRoute path="/danh-muc-to-chuc" component={CategoryClubs} />
                                            <PrivateRoute path="/danh-muc-tin-tuc" component={CategoryNewsPage} />
                                            <PrivateRoute path="/danh-muc-gioi-thieu" component={CategoryIntroduce} />
                                            <PrivateRoute path="/danh-muc-van-ban" component={CategoryDocument} />
                                            <PrivateRoute path="/danh-muc-sv5t" component={CategorySv5t} />
                                            <PrivateRoute path="/sv5t-ho-so" component={Sv5tApplicationPage} />
                                            <PrivateRoute path="/sv5t" component={Sv5tPage} />
                                        </>}
                                    </Switch >
                                </DefaultLayout >
                            ) : <Redirect to="/login" />
                        }
                    </Route>

                </Switch>
            </div >
        </Router >
    );
}

export default App;
