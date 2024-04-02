import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home/HomePage/HomePage'
import Login from './pages/Home/Login/Login'
import Register from './pages/Home/Register/Register'
import Film from './pages/Home/Film/Film'
import AdminFilm from './pages/Admin/AdminFilm/AdminFilm'
import AdminUser from './pages/Admin/AdminUser/AdminUser'
import AdminCategory from './pages/Admin/AdminCategory/AdminCategory'
import AdminShowTime from './pages/Admin/AdminShowTime/AdminShowTime'
import FriceTicket from './pages/Home/FriceTicket/FriceTicket'
import MyTicket from './pages/Home/MyTicket/MyTicket'
import WebTicket from './pages/Home/WebTicket/WebTicket'

type Props = {}

const App = (props: Props) => {
  
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<HomePage />} /> 
        <Route path='/film' element={<Film />} />
        <Route path='/admin' element={<AdminFilm/>} />
        <Route path='/userAdmin' element={<AdminUser/>} />
        <Route path='/categoryAdmin' element={<AdminCategory/>} />
        <Route path='/showtimeAdmin' element={<AdminShowTime/>} />
        <Route path='/ticket' element={<FriceTicket />} />
        <Route path='/myticket' element={<MyTicket/>} />
        <Route path='/myWebTicket' element={<WebTicket/>} />
      </Routes>
    </>
  )
}

export default App