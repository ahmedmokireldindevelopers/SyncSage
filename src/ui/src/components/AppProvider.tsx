import React, { type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import AppLayout from "components/AppLayout";
import { APP_BASE_PATH } from "app"; // Import base path

interface Props {
  children: ReactNode; // This children prop contains the <Outlet /> from AppWrapper
}

// Define raw paths (relative to base) where AppLayout should NOT be applied
const excludedPathsRaw = ["/", "/Login", "/Signup"];

/**
 * A provider wrapping the whole app.
 *
 * This component now conditionally applies the main AppLayout based on the route.
 *
 * Note: ThemeProvider is already included in AppWrapper.tsx and does not need to be added here.
 */
export const AppProvider = ({ children }: Props) => {
  const location = useLocation();
  const currentPathname = location.pathname;

  // Function to normalize a path by ensuring it ends with a single slash if it's not just '/' or empty
  const normalizePath = (path: string): string => {
    if (path === "/" || path === "") {
      return "/";
    }
    return path.endsWith("/") ? path : `${path}/`;
  };

  // Normalize the base path
  const normalizedBasePath = normalizePath(APP_BASE_PATH);

  // Construct the full excluded paths based on the normalized base path
  const excludedPaths = excludedPathsRaw.map((rawPath) => {
    // Handle the root path case specially
    if (rawPath === "/") {
      // If base path is '/', excluded is '/'. If base path is '/foo/', excluded is '/foo/'
      return normalizedBasePath;
    }
    // For non-root paths, combine base path and raw path
    // If base is '/foo/' and raw is '/Login', result is '/foo/Login'
    // If base is '/' and raw is '/Login', result is '/Login'
    return `${normalizedBasePath}${rawPath.substring(1)}`;
  });

  // Check if the current pathname exactly matches any of the fully constructed excluded paths
  const isExcludedPath = excludedPaths.includes(currentPathname);

  // console.log("Current Path:", currentPathname);
  // console.log("Base Path:", APP_BASE_PATH);
  // console.log("Normalized Base Path:", normalizedBasePath);
  // console.log("Excluded Raw:", excludedPathsRaw);
  // console.log("Excluded Full:", excludedPaths);
  // console.log("Is Excluded:", isExcludedPath);

  // Conditionally apply the layout
  if (isExcludedPath) {
    return <>{children}</>; // Render Outlet directly for landing/auth pages
  } else {
    return <AppLayout>{children}</AppLayout>; // Wrap Outlet with AppLayout for main app pages
  }
};
