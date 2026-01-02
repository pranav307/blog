
import Login from './component/login'
import Signup from './component/signup'
import Postlist from './component/list'
import Profile from './component/profile/profile'
import Profileget from './component/profile/getpro'
import { Route, Routes } from 'react-router-dom'
import Home from './component/home'
import Postcreate from './component/postcrud/posts'
import Userarticlelist from './component/postcrud/getlist'
import Userarticlebyid from './component/postcrud/getpostid'
import Protectedroute from './component/protect'
import Imagevideo from './component/imagehandle/imagev'
import './index.css'
import Articlebyid from './component/getartbyid'
function App() {


  return (
    <>
    
    
    <Routes>
  <Route element={<Home/>}>
  <Route path="/lo" element={<Login />} />

  {/* post list for everyone */}
  <Route index element={<Postlist />} />

  {/* details by id */}
  <Route path="/a/:id" element={<Articlebyid />} />

  <Route path="/sign" element={<Signup />} />

  <Route element={<Protectedroute />}>
    <Route path="/gl" element={<Userarticlelist />} />
    <Route path="/article/:id" element={<Userarticlebyid />} />
    <Route path="/cre" element={<Postcreate />} />
    <Route path="/up/:id" element={<Postcreate />} />
    <Route path="/pro" element={<Profileget />} />
    <Route path="/pp" element={<Profile />} />
    <Route path="/img/:id" element={<Imagevideo />} />
  </Route>
  </Route>
</Routes>

     
     
    </>
  )
}

export default App
