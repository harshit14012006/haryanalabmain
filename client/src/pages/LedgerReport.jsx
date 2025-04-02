import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPDF from "@react-pdf/renderer";
import AccountLedger from "./AccountLedger";

const headers = ["Entry Date", "Report Number", "Credit", "Debit", "Remarks"];

const LedgerReport = () => {
  const [data, setData] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [dates, setDates] = useState({});
  const [partyName, setPartyName] = useState("");
  const [selectedParty, setSelectedParty] = useState({});
  const [reportData, setReportData] = useState(null);
  const [values, setValues] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

  // Fetch customers
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/customers")
      .then((response) => {
        setCustomer(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Handle party selection
  const handlePartySelect = (event) => {
    const selectedPartyName = event.target.value;
    const party = customer.find((p) => p.Partyname === selectedPartyName) || {};

    setPartyName(selectedPartyName);
    setSelectedParty(party);

    if (!selectedPartyName) {
      setFilteredData(data); // Show all data if no party selected
      setValues(null);
      return;
    }

    // Filter data based on selected party
    const partyData = data.filter((item) => item.PartyName === selectedPartyName);

    // Calculate totals
    const debitSum = partyData.reduce((acc, item) => acc + Number(item.Debit || 0), 0);
    const creditSum = partyData.reduce((acc, item) => acc + Number(item.Credit || 0), 0);
    const openingBalance = Number(party.Openingbalance) || 0;
    const totalBalance = creditSum - debitSum + openingBalance;

    setFilteredData(partyData);
    setValues({
      Total: creditSum,
      Paid: debitSum,
      Balance: totalBalance,
      ClosingBalance: creditSum - debitSum,
    });

    // Fetch additional analysis data if needed
    fetchData(party.Name);
  };

  const fetchData = (partyName) => {
    axios
      .get(`http://localhost:3001/api/analysises/${partyName}`)
      .then((response) => {
        setReportData(response.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Fetch data based on dates
  const findData = async () => {
    if (!dates.fromDate || !dates.toDate) {
      console.log("Please select valid dates.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3001/api/usersDate/${dates.fromDate}/${dates.toDate}`
      );

      if (response.data && response.data.length > 0) {
        const formattedReports = response.data.map((item) => ({
          ...item,
          Date: formatDate(item.Date),
        }));

        setData(formattedReports);
        
        // If a party is selected, filter immediately
        if (partyName) {
          const partyData = formattedReports.filter((item) => item.PartyName === partyName);
          setFilteredData(partyData);
          
          const debitSum = partyData.reduce((acc, item) => acc + Number(item.Debit || 0), 0);
          const creditSum = partyData.reduce((acc, item) => acc + Number(item.Credit || 0), 0);
          const openingBalance = Number(selectedParty.Openingbalance) || 0;
          
          setValues({
            Total: creditSum,
            Paid: debitSum,
            Balance: creditSum - debitSum + openingBalance,
            ClosingBalance: creditSum - debitSum,
          });
        } else {
          setFilteredData(formattedReports);
        }
      } else {
        setData([]);
        setFilteredData([]);
        setValues(null);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
      setData([]);
      setFilteredData([]);
      setValues(null);
    }
  };

  const HandleClick = async () => {
    if (!filteredData.length) return;

    const pdfBlob = await ReactPDF.pdf(
      <AccountLedger
        Data={filteredData}
        Balance={values?.Balance || 0}
        OpeningBalance={selectedParty?.Openingbalance || 0}
        Date1={dates.fromDate ? formatDate(dates.fromDate) : ""}
        Date2={dates.toDate ? formatDate(dates.toDate) : ""}
        PartyName={partyName}
        City={selectedParty?.City || ""}
      />
    ).toBlob();

    const newBlobUrl = URL.createObjectURL(pdfBlob);
    window.open(newBlobUrl);

    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
    }
    setPdfBlobUrl(newBlobUrl);
  };

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Rest of your JSX remains largely the same
  return (
    <div className="bg-gray-100">
      <div className="flex justify-center min-h-screen">
        <div className="w-full max-w-4xl">
          <form onSubmit={(e) => e.preventDefault()}>
            <fieldset className="w-full p-3 border border-gray-300 rounded-md">
              <legend className="text-sm">Ledger Report</legend>
              {/* Date Inputs */}
              <div className="flex justify-center space-x-14">
                <div className="flex items-center space-x-6">
                  <label htmlFor="fromDate" className="font-medium">
                    From
                  </label>
                  <input
                    type="date"
                    id="fromDate"
                    name="fromDate"
                    required
                    className="h-5 p-2 border border-gray-300"
                    onChange={(e) =>
                      setDates((prev) => ({ ...prev, fromDate: e.target.value }))
                    }
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label htmlFor="toDate" className="font-medium">
                    To
                  </label>
                  <input
                    type="date"
                    id="toDate"
                    name="toDate"
                    required
                    className="h-5 p-2 border border-gray-300"
                    onChange={(e) =>
                      setDates((prev) => ({ ...prev, toDate: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end mt-2 mr-24">
                <button
                  type="button"
                  className="h-8 px-4 py-1 bg-gray-400 rounded-md"
                  onClick={findData}
                >
                  Display
                </button>
              </div>
              {/* Party Selection */}
              <div className="grid grid-cols-2 gap-4 ml-36">
                <div className="flex items-center space-x-4">
                  <label htmlFor="party" className="font-medium">
                    Party
                  </label>
                  <select
                    className="box-border w-[70%] h-8 p-1 border border-gray-300 rounded-md appearance-none cursor-pointer"
                    onChange={handlePartySelect}
                    value={partyName}
                  >
                    <option value="">Select Party</option>
                    {customer.map((party, index) => (
                      <option key={index} value={party.Partyname}>
                        {party.Partyname}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Rest of your form JSX */}
                <div className="flex flex-col space-y-1">
                  <label htmlFor="city" className="font-medium">
                    City : {selectedParty.City || ""}
                  </label>
                </div>
                <div className="flex flex-col space-y-1">
                  <label htmlFor="totalSamples" className="font-medium">
                    Total no. of samples: {reportData || ""}
                  </label>
                </div>
                <div className="flex flex-col space-y-1">
                  <label htmlFor="openingBalance" className="font-medium">
                    Opening balance: {selectedParty.Openingbalance || ""}
                  </label>
                </div>
              </div>
              {/* Table */}
              <div className="relative overflow-x-auto overflow-y-auto h-[320px] w-[850px]">
                <table className="min-w-full bg-white border border-gray-300 table-auto">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-300">
                      {headers.map((header, index) => (
                        <th
                          key={index}
                          className="text-sm text-left border-gray-300 whitespace-nowrap"
                          style={{
                            fontSize: "13px",
                            fontWeight: "normal",
                            minWidth: "150px",
                            width: "150px",
                          }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row, i) => (
                      <tr
                        key={i}
                        className="transition-colors duration-300 hover:bg-blue-500 hover:text-white"
                      >
                        <td className="text-sm border border-gray-300 whitespace-nowrap" style={{ minWidth: "150px" }}>
                          {row.Date}
                        </td>
                        <td className="text-sm border border-gray-300 whitespace-nowrap" style={{ minWidth: "150px" }}>
                          {row.Reportno === "null" ? "" : row.Reportno}
                        </td>
                        <td className="text-sm border border-gray-300 whitespace-nowrap" style={{ minWidth: "150px" }}>
                          {row.Credit}
                        </td>
                        <td className="text-sm border border-gray-300 whitespace-nowrap" style={{ minWidth: "150px" }}>
                          {row.Debit}
                        </td>
                        <td className="text-sm border border-gray-300 whitespace-nowrap" style={{ minWidth: "150px" }}>
                          {row.Remarks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Totals */}
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex-1">
                  <label htmlFor="totalAmount" className="block font-medium">
                    Total Amount : {values?.Total || ""}
                  </label>
                </div>
                <div className="flex-1">
                  <label htmlFor="paidAmount" className="block font-medium">
                    Paid Amount : {values?.Paid || ""}
                  </label>
                </div>
                <div className="flex-1">
                  <label htmlFor="openingBalance" className="block font-medium">
                    Balance : {values?.Balance || ""}
                  </label>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="h-8 px-4 py-1 bg-gray-400 rounded-md"
                  onClick={HandleClick}
                >
                  Print
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LedgerReport;