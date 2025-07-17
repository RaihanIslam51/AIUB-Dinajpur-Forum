import {
  createBrowserRouter
} from "react-router";
import Register from "../Authantication/Register";
import SignIn from "../Authantication/SignIn";
import AddPost from "../Pages/Dashboard/UserDashboard/AddPost";
import MyPosts from "../Pages/Dashboard/UserDashboard/MyPosts";
import MyProfile from "../Pages/Dashboard/UserDashboard/MyProfile";
import HomePage from "../Pages/Home/HomePage";
import Membership from "../Pages/Membership/Membership";
import Profile from "../Pages/Shared/Profile";
import AuthRoot from "../RootLayout/AuthRoot";
import DashboardLayout from "../RootLayout/DashboardLayout";
import RootLayout from "../RootLayout/RootLayout";
export const router = createBrowserRouter([
  {
    path: "/",
    Component:RootLayout,
    children :[
      {index:true, path:"/", Component:HomePage},
      {path:"/membership", Component:Membership}
    ]
  },
  {
    path: "/auth",
    Component :AuthRoot,
       children:[
      {path:"/auth/register", Component:Register},
      {path:"/auth/login", Component:SignIn},
      {path:"/auth/profile", Component:Profile}
    ]
    
  },
  {
    path: "/dashboard",
    Component :DashboardLayout,
    children : [
      {path :"/dashboard/MyProfile",Component:MyProfile},
      {path:"/dashboard/AddPost", Component:AddPost},
      {path:"/dashboard/MyPosts", Component:MyPosts}
    ]
  }
]);