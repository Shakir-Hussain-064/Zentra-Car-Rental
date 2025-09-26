import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = ({}) => {

    const {setShowLogin, axios, setToken, navigate} = useAppContext()

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async(e) => {
        try {
            e.preventDefault();
            const {data} = await axios.post(`/api/user/${state}`, {name, email, password})

            if(data.success){
                navigate('/')
                setToken(data.token)
                localStorage.setItem('token', data.token)
                setShowLogin(false)
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    <div onClick={() => setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center text-sm text-gray-300 bg-black/70'>
     <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 items-start p-8 py-12 w-80 sm:w-[352px] text-gray-300 rounded-lg shadow-xl border border-gray-600 bg-gray-800">
            <p className="text-2xl font-medium m-auto text-gray-200">
                <span className="text-blue-400">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-600 rounded w-full p-2 mt-1 bg-gray-700 text-gray-200 placeholder-gray-400 outline-blue-500" type="text" required />
                </div>
            )}
            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-600 rounded w-full p-2 mt-1 bg-gray-700 text-gray-200 placeholder-gray-400 outline-blue-500" type="email" required />
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-600 rounded w-full p-2 mt-1 bg-gray-700 text-gray-200 placeholder-gray-400 outline-blue-500" type="password" required />
            </div>
            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-blue-400 cursor-pointer hover:text-blue-300">click here</span>
                </p>
            ) : (
                <p>
                    Create an account? <span onClick={() => setState("register")} className="text-blue-400 cursor-pointer hover:text-blue-300">click here</span>
                </p>
            )}
            <button className="bg-blue-600 hover:bg-blue-700 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {state === "register" ? "Create Account" : "Login"}
            </button>
        </form>
    </div>
  )
}

export default Login
