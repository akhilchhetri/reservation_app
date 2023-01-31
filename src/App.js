import { Fragment } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./services/api"

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './pages/dashboard'

import './App.css';

function App() {
  return (
    <div className="App">
      <Fragment>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </Fragment>
      <ToastContainer toastClassName="text-16" />
    </div>
  );
}

export default App;
