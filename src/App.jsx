import react, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import PaymentPage from "./pages/paymentPage/paymentPage.jsx";
import Notfound from "./pages/notFound/notFound.jsx";
import PrePayment from "./pages/prePayment/prePayment.jsx";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<PaymentPage />} />
      <Route path="/prepayment" element={<PrePayment />} />
      <Route path="/*" element={<Notfound />} />
    </Routes>
  );
};

export default App;
