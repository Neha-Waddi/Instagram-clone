// pages/Home.jsx or PostPage.jsx
import CreatePost from '../components/CreatePost';
const Home = () => {
    const userId = localStorage.getItem("userId");
  
    return (
      <div className="max-w-md mx-auto mt-4">
        <CreatePost userId={userId} />
      </div>
    );
  };
  

export default Home;
