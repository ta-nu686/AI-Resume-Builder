import { Lock, Mail, User2Icon } from 'lucide-react'
import React from 'react'
import api from '../configs/api'
import { useDispatch } from 'react-redux'
import { login } from '../app/features/authSlice'
import toast from 'react-hot-toast'

const Login = ({ initialState = 'login' }) => {

   const dispatch=useDispatch()
  const [state, setState] = React.useState(initialState)


  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: ''
  })

  React.useEffect(() => {
    setState(initialState)
  }, [initialState])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post(`/api/users/${state}`, formData)
      dispatch(login(data))
      localStorage.setItem('token', data.token)
      toast.success(data.message)
    } catch (error) {
      toast(error?.response?.data?.message || error.message)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
  onSubmit={handleSubmit}
  className="w-full max-w-md bg-white border border-gray-200 rounded-2xl px-10 py-12 text-center shadow-sm"
>

        <h1 className="text-3xl font-semibold text-gray-900">
          {state === "login" ? "Login" : "Sign up"}
        </h1>

        <p className="text-sm text-gray-500 mt-2 mb-8">
          Please login to continue
        </p>

        {state !== "login" && (
          <div className="flex items-center h-12 w-full border border-gray-300 rounded-full px-5 gap-3 mb-4">
            <User2Icon size={16} className="text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
              required
            />
          </div>
        )}

        <div className="flex items-center h-12 w-full border border-gray-300 rounded-full px-5 gap-3 mb-4">
          <Mail size={16} className="text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="Email id"
            value={formData.email}
            onChange={handleChange}
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
            required
          />
        </div>

        <div className="flex items-center h-12 w-full border border-gray-300 rounded-full px-5 gap-3 mb-3">
          <Lock size={16} className="text-gray-400" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
            required
          />
        </div>

        <div className="text-left mb-4">
          <button type="button" className="text-sm text-teal-500 hover:underline">
            Forget password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full h-11 rounded-full bg-teal-500 text-white text-sm font-medium hover:opacity-90 transition"
        >
          {state === "login" ? "Login" : "Sign up"}
        </button>

        <p className="text-sm text-gray-500 mt-5">
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <span
            onClick={() =>
              setState(prev => (prev === "login" ? "register" : "login"))
            }
            className="ml-1 text-teal-500 cursor-pointer hover:underline"
          >
            click here
          </span>
        </p>
      </form>
    </div>
  )
}

export default Login
