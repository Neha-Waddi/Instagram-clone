import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");   
    const [password, setPassword] = useState("");  
    const [error, setError] = useState(null); 
    const navigate = useNavigate();  

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/users/login",
                { email, password },
                { withCredentials: true }
            );

            console.log("Login Successful:", response.data);
            navigate("/dashboard"); 
        } catch (error) {
            console.error("Login Failed:", error.response?.data?.message || error.message);
            setError(error.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <div className="bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] w-full min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center justify-center p-10 border-2 border-gray-300 w-96 bg-white rounded-lg shadow-lg space-y-4">
                <img src={logo} alt="INSTAGRAM" className="w-44 h-14" />

                {error && <p className="text-red-500">{error}</p>}

                <input 
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-gray-500 border-2 border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-gray-500 border-2 border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button 
                    onClick={handleLogin}
                    className="bg-blue-500 text-white w-full p-2 rounded-md hover:bg-blue-600 transition duration-200"
                >
                    Log In
                </button>

                <p className="text-gray-500 text-sm cursor-pointer hover:underline">
                    Forgot Password?
                </p>

                <div className="w-full border-t border-gray-300 pt-4 text-center">
                    <p className="text-gray-700">
                        Don't have an account?  
                        <Link to="/signup" className="text-blue-500 font-semibold hover:underline ml-1">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
