import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/users/me", { withCredentials: true })
        .then(response => setUser(response.data))
        .catch(() => navigate("/login")); // Redirect if unauthorized
}, []);


  return (
    <div>
      {user ? (
        <h1>Welcome, {user.username}!</h1>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default Dashboard;
