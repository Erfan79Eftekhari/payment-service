import react, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import PaymentPage from "./pages/paymentPage/paymentPage.jsx";
import Notfound from "./pages/notFound/notFound.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/*" element={<Notfound />} />
    </Routes>
  );
};

export default App;
