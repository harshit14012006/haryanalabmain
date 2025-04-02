import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateReport from "./pages/CreateReport";
import CustomerForm from "./pages/CustomerForm";
import CreateItem from "./pages/CreateItem";
import UpdateReport from "./pages/UpdateReport";
import MasterCity from "./pages/MasterCity";
import LedgerEntry from "./pages/LedgerEntry";
import LedgerReport from "./pages/LedgerReport";
import CashVoucher from "./pages/CashVoucher";
import SingleReportReprint from "./pages/SingleReportReprint";
import RecordReport from "./pages/RecordReport";
import RecordReportWithoutSample from "./pages/RecordReportWithoutSample";
import PartyDetailPrint from "./pages/PartyDetailPrint";
import PrintMultiReport from "./pages/PrintMultipleReport";
import GenerateLetterPad from './pages/GenerateLetterPad'
const Layout = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/customer-form" element={<CustomerForm />} />
        <Route path="/create-item" element={<CreateItem />} />
        <Route path="/master-city" element={<MasterCity />} />
        <Route path="/reports-analysis" element={<CreateReport />} />
        <Route path="/update-analysis" element={<UpdateReport />} />
        <Route path="/ledger-entry" element={<LedgerEntry />} />
        <Route path="/ledger-report" element={<LedgerReport />} />
        <Route path="/cash-voucher" element={<CashVoucher />} />
        <Route
          path="/single-report-reprint"
          element={<SingleReportReprint />}
        />
        <Route path="/print-multi-report" element={<PrintMultiReport />} />
        <Route path="/record-report" element={<RecordReport />} />
        <Route path="/party-detail-print" element={<PartyDetailPrint />} />
        <Route
          path="/record-report-without-sample"
          element={<RecordReportWithoutSample />}
        />
        <Route
          path="/generate-letterpad"
          element={<GenerateLetterPad />}
        />
      </Routes>
    </Router>
  );
};

export default Layout;
