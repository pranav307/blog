import { Navigate, Outlet } from "react-router-dom"


function Protectedroute(){
    const token =localStorage.getItem("access") || null

    if(!token){
        return <Navigate to="/lo"></Navigate>
    }
    return <Outlet/>
}

export default Protectedroute