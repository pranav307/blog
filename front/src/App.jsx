import { useState } from 'react'

import './App.css'
import Login from './component/login'
import Signup from './component/signup'
import Postlist from './component/list'

function App() {


  return (
    <>
    <h1>home page</h1>
      <Login/>
      <Signup/>
      <Postlist/>
    </>
  )
}

export default App
