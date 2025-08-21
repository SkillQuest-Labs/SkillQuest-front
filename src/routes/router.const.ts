export interface IRoute {
  path: string;
  display: string;
}

export interface IRoutes {
  dashboard: IRoute;
  skills: IRoute;
  skillDetail: IRoute;
  profil: IRoute;
  store: IRoute;
  canvas: IRoute;
  workSession: IRoute;
  avatar: IRoute;
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
  skillDetail: {
    path: "/dashboard/skills/:skillId",
    display: "Skill Detail",
  },
  profil: {
    path: "/dashboard/profil",
    display: "Profil",
  },
  store: {
    path: "/dashboard/store",
    display: "Store",
  },
  avatar: {
    path: "/dashboard/avatar",
    display: "Avatar",
  },
  canvas: {
    path: "/canvas",
    display: "Canvas",
  },
  workSession: {
    path: "/dashboard/work-session",
    display: "WorkSession",
  },
  notfound: {
    path: "*",
    display: "Not found",
  },
};
