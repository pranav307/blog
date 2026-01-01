import { useState } from 'react'

import './App.css'
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

function App() {


  return (
    <>
    <h1>home page</h1>
    <Home></Home>
    <Routes>

      <Route path="/lo" element={<Login/>}></Route>
      {/* post list for everyone */}
      <Route path="" element={<Postlist/>} index></Route>
      <Route path="/sign" element={<Signup/>}></Route>
      <Route element={<Protectedroute/>}>
      {/* user article list */}
      <Route path='/gl' element={<Userarticlelist/>}></Route>
      <Route path='/article/:id' element={<Userarticlebyid/>}></Route>
      {/* create post article */}
      <Route path='/cre' element={<Postcreate/>}></Route> 
      {/* update post article */}
      <Route path="/up/:id" element={<Postcreate/>}></Route>
      {/* profile */}
      <Route path="/pro" element={<Profileget/>}></Route>
      <Route path="/pp" element={<Profile/>}></Route>
      {/* image upload */}
      <Route path="/img/:id" element={<Imagevideo/>}></Route>
      </Route>
     
     
     
    </Routes>
     
     
    </>
  )
}

export default App
