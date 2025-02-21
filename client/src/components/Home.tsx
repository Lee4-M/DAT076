import React, { useEffect, useState } from "react";
import { getSessionUser } from "./apiLogin";

const Home: React.FC = () => {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionUser = await getSessionUser();
        console.log("apaapapap" + sessionUser)
        setUser(sessionUser);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold">Home Page</h2>
      {user ? (
        <p className="text-green-500">Logged in as: {user.username}</p>
      ) : (
        <p className="text-red-500">Not logged in</p>
      )}
      <button></button>
    </div>
  );
};

export default Home;
