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

function App() {


  return (
    <>
    <h1>home page</h1>
    <Home></Home>
    <Routes>

      <Route path="/lo" element={<Login/>}></Route>
      <Route path="" element={<Postlist/>} index></Route>
      <Route path="/sign" element={<Signup/>}></Route>
      <Route element={<Protectedroute/>}>
      <Route path='/gl' element={<Userarticlelist/>}></Route>
      <Route path='/article/:id' element={<Userarticlebyid/>}></Route>
      <Route path='/cre' element={<Postcreate/>}></Route>
      <Route path="/up/:id" element={<Postcreate/>}></Route>
      <Route path="/pro" element={<Profileget/>}></Route>
      <Route path="/pp" element={<Profile/>}></Route>
      </Route>
     
     
     
    </Routes>
     
     
    </>
  )
}

export default App
