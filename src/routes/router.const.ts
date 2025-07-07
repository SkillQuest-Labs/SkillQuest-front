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
}

export const routes: IRoutes = {
  dashboard: {
    path: "/dashboard",
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
  notfound: {
    path: "*",
    display: "Not found",
  },
};
