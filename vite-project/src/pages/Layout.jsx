import React from 'react'
import {Outlet, useLocation} from 'react-router-dom'
import Navbar from '../components/Navbar'
import {useSelector} from 'react-redux'
import Loader from '../components/Loader'
import Login from './Login'

const Layout = () =>{
  const {user,loading}=useSelector(state=>state.auth)
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const formState = searchParams.get('state') || 'login'

  if(loading){
    return <Loader />
  }

  return(
    <div>
      {
        user?(
        <div className='min-h-screen bg-gray-50'>
          <Navbar />
            <Outlet />
        </div>
        )
        :<Login initialState={formState} />
      }
    </div>
  )
}

export default Layout