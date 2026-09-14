import { RouteProps, Route, Redirect } from "react-router-dom"

type PrivateRouteProps = {
	path: RouteProps["path"]
	component: any
	exact?: boolean
}
export const PrivateRoute = ({
	component: Component,
	...routeProps
}: PrivateRouteProps) => {
	const sessionId = window.localStorage.getItem("sessionId")
	return (
		<>
			<Route
				{...routeProps}
			>
				{sessionId ? <Component /> : <Redirect to="/login" />}
			</Route>
		</>
	)
}
