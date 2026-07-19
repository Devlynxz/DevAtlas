import "./App.css";
import React, { useState, useEffect } from "react";
import Forgot from "./form/Forgot";
import Login from "./form/Login";
import Register from "./form/Register";
import Home from "./Home";

function App() {
  const [page, setPage] = useState("login");
  const [token, setToken] = useState();

  useEffect(() => {
    const auth = localStorage.getItem("auth_token");
    setToken(auth);
  }, [token]);

  const chosePage = () => {
    if (page === "login") {
      return <Login setPage={setPage} />;
    }
    if (page === "forgot") {
      return <Forgot setPage={setPage} />;
    }
    if (page === "register") {
      return <Register setPage={setPage} />;
    }
  };

  const pages = () => {
    if (token == null) {
      return (
        <div className="min-h-screen bg-blue-400 flex flex-col justify-between">
        <header className="bg-blue-200 py-4 px-8">
          <h1 className="text-4xl font-extrabold text-white">
            Codecrew Seeker
          </h1>
        </header>

          <div className="flex-grow bg-blue-400 flex justify-center items-center">
            <div className="py-12 px-12 bg-white rounded-2xl shadow-xl z-20">
              {chosePage()}
            </div>
          </div>
           
          <footer className="bg-gray-200 py-5 px-8 text-center">
            <p className="text-sm text-gray-500">
              All rights reserved. &copy; Codecrew Seekers, 2023
            </p>
          </footer>
        </div>
      );
    } else {
      return <Home />;
    }
  };

  console.log(token);

  return <React.Fragment>{pages()}</React.Fragment>;
}

export default App;
