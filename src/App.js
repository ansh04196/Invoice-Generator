import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Container from "react-bootstrap/Container";
import { Route, Routes } from "react-router-dom";
import Invoice from "./pages/Invoice";
import InvoiceList from "./pages/InvoiceList";
import InvoiceEditBulk from "./pages/InvoiceEditBulk";

const App = () => {
  return (
    <div className="App d-flex flex-column align-items-center justify-content-center w-100">
      <Container>
        <Routes>
          <Route path="/" element={<InvoiceList />} />
          <Route path="/create" element={<Invoice />} />
          <Route path="/create/:id" element={<Invoice />} />
          <Route path="/edit/:id" element={<Invoice />} />
          <Route path="/edit-all" element={<InvoiceEditBulk />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
