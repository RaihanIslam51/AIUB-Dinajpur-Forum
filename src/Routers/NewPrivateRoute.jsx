
import { Navigate } from 'react-router'
import useAuth from '../Hooks/AxiosSeure/useAuth'
import WebsiteLoading from '../Loader/WebsiteLoading'


const NewPrivateRoute = ({children}) => {
    const {Loading,UserData,} = useAuth()

    if(Loading){
        return <WebsiteLoading />
    }
    if(!UserData){
        return <Navigate to='/auth/login' ></Navigate>
    }
  return children
}



export default NewPrivateRoute