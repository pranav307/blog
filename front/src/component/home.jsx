import { Link, Outlet } from "react-router-dom";


function Home(){
  
    return <>
     <>
    <Link to="">Posts</Link>
    <Link to="/lo">Login</Link>
    <Link to="/cre">Create Post</Link>
    </>
    <Outlet/>
    </>
}

export default Home