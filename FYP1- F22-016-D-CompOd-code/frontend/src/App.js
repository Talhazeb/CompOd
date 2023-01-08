import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pdf from "./components/Pdf";
import InvoicePDF from "./components/InvoicePDF";

import UserContext from "./context/UserContext";

function App() {
    const [user, setUser] = React.useState({});
  return (
    <div className="App">
      <Router>
      <UserContext.Provider value={{ user, setUser }}>
        <Routes>
         
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/viewPDF" element={<Pdf />} />
          <Route path="/invoicePDF" element={<InvoicePDF />} />
          
        </Routes>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
