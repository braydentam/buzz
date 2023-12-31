import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Buzz from "./pages/Buzz";
import Profile from "./pages/Profile";
import Following from "./pages/Following";
import { useAuthContext } from "./hooks/useAuthContext";

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/" />}
          />
          <Route
            exact
            path="/buzz/:id"
            element={user ? <Buzz /> : <Navigate to="/login" />}
          />
          <Route
            exact
            path="/following"
            element={user ? <Following /> : <Navigate to="/login" />}
          />
          <Route
            exact
            path="/profile/:username"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
