export interface IRoute {
  path: string;
  display: string;
}

export interface IRoutes {
  dashboard: IRoute;
  skills: IRoute;
  profil: IRoute;
  store: IRoute;
  canvas: IRoute;
  notfound: IRoute;
  signIn: IRoute;
  signUp: IRoute;
  unauthorized: IRoute;
}

export const routes: IRoutes = {
  dashboard: {
    path: "/",
    display: "Dashboard",
  },
  skills: {
    path: "/dashboard/skills",
    display: "Skills",
  },
  profil: {
    path: "/dashboard/profil",
    display: "Profil",
  },
  store: {
    path: "/dashboard/store",
    display: "Store",
  },
  canvas: {
    path: "/canvas",
    display: "Canvas",
  },
  signIn: {
    path: "/sign-in",
    display: "Sign In",
  },
  signUp: {
    path: "/sign-up",
    display: "Sign Up",
  },
  notfound: {
    path: "*",
    display: "Not found",
  },
  unauthorized: {
    path: "/unauthorized",
    display: "Unauthorized",
  },
};
