import {
  createBrowserRouter
} from "react-router";
import Register from "../Authantication/Register";
import SignIn from "../Authantication/SignIn";
import AdminProfile from "../Pages/Dashboard/AdminDashboard/AdminProfile";
import MakeAnnouncement from "../Pages/Dashboard/AdminDashboard/MakeAnnouncement";
import ManageUsers from "../Pages/Dashboard/AdminDashboard/ManageUsers";
import ReportedComments from "../Pages/Dashboard/AdminDashboard/ReportedComments";
import Comment from "../Pages/Dashboard/Comment/Comment";
import AddPost from "../Pages/Dashboard/UserDashboard/AddPost";
import MyPosts from "../Pages/Dashboard/UserDashboard/MyPosts";
import MyProfile from "../Pages/Dashboard/UserDashboard/MyProfile";
import Announcement from "../Pages/Home/Announcement";
import DetailsPost from "../Pages/Home/DetailsPost";
import HomePage from "../Pages/Home/HomePage";
import Membership from "../Pages/Membership/Membership";
import Profile from "../Pages/Shared/Profile";
import AuthRoot from "../RootLayout/AuthRoot";
import DashboardLayout from "../RootLayout/DashboardLayout";
import RootLayout from "../RootLayout/RootLayout";
// import PrivateRoute from "./PrivateRoutes";
export const router = createBrowserRouter([
  {
    path: "/",
    Component:RootLayout,
    children :[
      {index:true, path:"/", Component:HomePage},
      {path:"/membership", 
        element : <Membership></Membership>
        
  },
      {path:"/postDetails/:id",Component:DetailsPost},
      {path:"/notifications", Component:Announcement}
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
      
      {path:"/dashboard/MyPosts", Component:MyPosts},
      {path:'/dashboard/comment', Component:Comment},
      {path:"/dashboard/AdminProfile",Component:AdminProfile},
      {path:"/dashboard/ManageUsers", Component:ManageUsers},
      {path:"/dashboard/ReportedComments", Component:ReportedComments},
      {path:"/dashboard/MakeAnnouncement", Component:MakeAnnouncement}
    ]
  }
]);