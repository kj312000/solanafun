import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import TipJar from "./pages/Tipjar";
import Leaderboard from "./pages/Leaderboard";
import About from "./pages/About";

export default function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
        {/* Fixed Navbar */}
        <div className="flex-none">
          <Navbar />
        </div>

        {/* Scrollable main content */}
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/tipjar"
              element={
                <div className="h-full overflow-y-auto">
                  <TipJar />
                </div>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <div className="h-full overflow-y-auto">
                  <Leaderboard />
                </div>
              }
            />
            <Route
              path="/about"
              element={
                <div className="h-full overflow-y-auto">
                  <About />
                </div>
              }
            />
          </Routes>

        </div>
      </div>
    </BrowserRouter>
  );
}

