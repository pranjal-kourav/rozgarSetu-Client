// components/Router.jsx
import { useApp } from "../context/AppContext";

import Landing from "./Landing";
import Auth from "./Auth";
import HirerDash from "./HirerDash";
import SeekerDash from "./SeekerDash";
import Jobs from "./Jobs";
import HirerGigs from "./HirerGigs";
import SeekerGigs from "./SeekerGigs";
import Applications from "./Applications";
import PostJob from "./PostJob";
import Profile from "./Profile";
import ViewProfile from "./ViewProfile";
import AppStatus from "./AppStatus";
import Review from "./Review";

export default function Router() {
  const { page } = useApp();

  const pages = {
    landing: <Landing />,
    auth: <Auth />,
    "hirer-dash": <HirerDash />,
    "seeker-dash": <SeekerDash />,
    jobs: <Jobs />,
    "hirer-gigs": <HirerGigs />,
    "seeker-gigs": <SeekerGigs />,
    applications: <Applications />,
    "post-job": <PostJob />,
    profile: <Profile />,
    "view-profile": <ViewProfile />,
    "app-status": <AppStatus />,
    review: <Review />
  };

  return pages[page] || <Landing />;
}