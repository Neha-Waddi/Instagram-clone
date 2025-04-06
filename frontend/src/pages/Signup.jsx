import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";

function Signup() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault(); 

        try {
            const res = await fetch("http://localhost:5000/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", 
                body: JSON.stringify({ name, username, email, password }), // include name
            });

            const data = await res.json(); 

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            console.log("Registration Successful:", data);
            alert("Signup Successful!");
            navigate("/login"); 

        } catch (err) {
            console.error("Error:", err.message);
            setError(err.message);
        }
    };

    return (
        <div className="bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] w-full min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center justify-center p-10 border-2 border-gray-300 w-96 bg-white rounded-lg shadow-lg space-y-4">
                <img src={logo} alt="INSTAGRAM" className="w-44 h-14" />

                <p className="text-gray-500 text-sm text-center">
                    Sign up to see photos and videos from your friends.
                </p>

                <input 
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-gray-500 border-2 border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-gray-500 border-2 border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    placeholder="Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="text-gray-500 border-2 border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    placeholder="Password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-gray-500 border-2 border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button 
                    className="bg-blue-500 text-white w-full p-2 rounded-md hover:bg-blue-600 transition duration-200"
                    onClick={handleSignup}
                >
                    Sign Up
                </button>

                <div className="w-full border-t border-gray-300 pt-4 text-center">
                    <p className="text-gray-700">
                        Already have an account?  
                        <Link to="/login" className="text-blue-500 font-semibold hover:underline ml-1">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
