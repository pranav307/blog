import { Link, Outlet, useNavigate } from "react-router-dom";


function Home(){
    const navigate =useNavigate()
    const token =localStorage.getItem("access")
    const logout =()=>{
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
        localStorage.removeItem("user")
        alert("logout successfully")
        navigate("/lo")
    }
    return <>
     <div className="flex flex-row justify-evenly">
    <Link to="">Posts</Link>
     {token ? (<button onClick={logout}>Logout</button>):(<Link to="/lo">Login</Link>)}
    <Link to="/cre">Create Post</Link>
    <Link to="/gl">Your post</Link>
    <Link to="/pro">Profile</Link>
    
    </div>
    <Outlet/>
    </>
}

export default Home