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
  stats: IRoute;
  sessionsListing: IRoute;
  dojo: IRoute;
  dojoImmersive: IRoute;
  notfound: IRoute;
  signIn: IRoute;
  signUp: IRoute;
  unauthorized: IRoute;
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
  canvas: {
    path: "/canvas",
    display: "Canvas",
  },
  signIn: {
    path: "/sign-in/*",
    display: "Sign In",
  },
  signUp: {
    path: "/sign-up/*",
    display: "Sign Up",
  },
  workSession: {
    path: "/dashboard/work-session",
    display: "WorkSession",
  },
  stats: {
    path: "/dashboard/stats",
    display: "Statistiques",
  },
  sessionsListing: {
    path: "/dashboard/listing-sessions",
    display: "Listing Sessions",
  },
  dojo: {
    path: "/dashboard/dojo",
    display: "Dojo",
  },
  dojoImmersive: {
    path: "/dojo/:sessionId",
    display: "Dojo Immersif",
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
