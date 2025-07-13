import {
  createBrowserRouter
} from "react-router";
import Register from "../Authantication/Register";
import SignIn from "../Authantication/SignIn";
import HomePage from "../Pages/Home/HomePage";
import Profile from "../Pages/Shared/Profile";
import AuthRoot from "../RootLayout/AuthRoot";
import RootLayout from "../RootLayout/RootLayout";
export const router = createBrowserRouter([
  {
    path: "/",
    Component:RootLayout,
    children :[
      {index:true, path:"/", Component:HomePage}
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
    
  }
]);