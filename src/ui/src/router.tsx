import { AppProvider } from "components/AppProvider";
import { lazy } from "react";
import { Outlet, createBrowserRouter } from "react-router-dom";
import {
  APP_BASE_PATH,
  APP_DEPLOY_APPNAME,
  APP_DEPLOY_CUSTOM_DOMAIN,
  APP_DEPLOY_USERNAME,
  Mode,
  mode,
} from "./constants";
import { DevTools } from "./internal-components/DevTools";
import { SuspenseWrapper } from "./prod-components/SuspenseWrapper";
import { userRoutes } from "./user-routes";

const appBasePath = (): string => {
  const origin = window.location.hostname;

  if (APP_DEPLOY_CUSTOM_DOMAIN && origin === APP_DEPLOY_CUSTOM_DOMAIN) {
    return "/";
  }

  if (
    APP_DEPLOY_USERNAME &&
    APP_DEPLOY_APPNAME &&
    origin === `${APP_DEPLOY_USERNAME}.databutton.app`
  ) {
    return `/${APP_DEPLOY_APPNAME}`;
  }

  // Else origins databutton.com (devx, legacy prodx /u/username/appname, and localhost for testing)
  return APP_BASE_PATH;
};

const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const SomethingWentWrongPage = lazy(
  () => import("./pages/SomethingWentWrongPage"),
);

export const router = createBrowserRouter(
  [
    {
      element: (
        <DevTools shouldRender={mode === Mode.DEV}>
          <AppProvider>
            <SuspenseWrapper>
              <Outlet />
            </SuspenseWrapper>
          </AppProvider>
        </DevTools>
      ),
      children: userRoutes,
    },
    {
      path: "*",
      element: (
        <SuspenseWrapper>
          <NotFoundPage />
        </SuspenseWrapper>
      ),
      errorElement: (
        <SuspenseWrapper>
          <SomethingWentWrongPage />
        </SuspenseWrapper>
      ),
    },
  ],
  {
    basename: appBasePath(),
  },
);
