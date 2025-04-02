import React, { useState, useEffect } from "react";
import axios from "axios";

const headers = ["Entry Date", "Report Number", "Credit", "Debit", "Remarks"];

function CashVoucher() {
  const [vouchers, setVouchers] = useState([]);
  const [vouchersFilter, setVouchersFilter] = useState([]);
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [date, setDate] = useState("");
  const [partyName, setPartyName] = useState("");
  const [tableData, setTableData] = useState({
    id: "",
    Reportno: "",
    Date: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const customersResponse = await axios.get("http://localhost:3001/api/customers");
      setParties(customersResponse.data);

      const usersResponse = await axios.get("http://localhost:3001/api/users/");
      const formattedReports = usersResponse.data.map((item) => ({
        id: item.id,
        ...item,
        Date: formatDate(item.Date),
        Remarks: item.Remarks || "",
      }));
      setVouchersFilter(formattedReports);

      if (partyName) {
        const filterVouchers = formattedReports.filter(
          (item) => item.PartyName === partyName
        );
        setVouchers(filterVouchers);
      } else {
        setVouchers(formattedReports);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setVouchers([]);
    }
  };

  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }

  function formatDate2(dateString) {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  }

  const handlePartySelect = (event) => {
    const partyName = event.target.value;
    const party = parties.find((p) => p.Partyname === partyName);
    setSelectedParty(party || null);
    setPartyName(partyName);
    partyName
      ? setVouchers(vouchersFilter.filter((item) => item.PartyName === partyName))
      : setVouchers(vouchersFilter);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newVoucher = {
      Date: date,
      PartyName: selectedParty?.Partyname || "",
      Reportno: "null",
      Debit: amount,
      Remarks: remarks || "",
    };

    try {
      if (newVoucher.Date && newVoucher.PartyName && newVoucher.Debit) {
        const response = await axios.post("http://localhost:3001/api/users/Debit", newVoucher);
        console.log("POST Response:", response.data); // Debug log
        const formattedNewVoucher = {
          id: response.data.id,
          ...newVoucher,
          Date: formatDate(newVoucher.Date),
          Credit: null,
        };

        setVouchersFilter((prev) => {
          const exists = prev.some(
            (voucher) =>
              voucher.Date === formattedNewVoucher.Date &&
              voucher.PartyName === formattedNewVoucher.PartyName &&
              voucher.Debit === formattedNewVoucher.Debit &&
              voucher.Remarks === formattedNewVoucher.Remarks
          );
          if (exists) return prev;
          return [...prev, formattedNewVoucher];
        });

        setVouchers((prev) => {
          const exists = prev.some(
            (voucher) =>
              voucher.Date === formattedNewVoucher.Date &&
              voucher.PartyName === formattedNewVoucher.PartyName &&
              voucher.Debit === formattedNewVoucher.Debit &&
              voucher.Remarks === formattedNewVoucher.Remarks
          );
          if (exists) return prev;
          if (partyName) {
            return [...prev.filter((item) => item.PartyName === partyName), formattedNewVoucher];
          }
          return [...prev, formattedNewVoucher];
        });

        setTableData({
          id: response.data.id,
          Reportno: "null",
          Date: formatDate(newVoucher.Date),
        });

        setAmount("");
        setRemarks("");
        setDate("");
      } else {
        alert("Please fill in all required fields (Date, Party Name, Amount).");
      }
    } catch (error) {
      console.error("Error creating voucher:", error);
      alert("Error creating cash voucher");
    }
  };

  const HandleClick = (data) => {
    if (data.Debit !== null) {
      setPartyName(data.PartyName);
      setDate(formatDate2(data.Date));
      setAmount(data.Debit);
      setRemarks(data.Remarks || "");
      setTableData({
        id: data.id || "",
        Reportno: data.Reportno,
        Date: data.Date,
      });
    }
  };

  const HandleDelete = async () => {
    try {
      if (!tableData.id) {
        alert("Please select a row to delete by clicking anywhere on it, or add a new entry first.");
        return;
      }

      console.log("Deleting ID:", tableData.id); // Debug log
      // Use the correct DELETE endpoint based on index.js
      const response = await axios.delete(`http://localhost:3001/api/users/${tableData.id}`);
      console.log("DELETE Response:", response.data); // Debug log

      // Optimistically update the UI by removing the deleted voucher
      setVouchers((prev) => {
        const updated = prev.filter((voucher) => voucher.id !== tableData.id);
        console.log("Updated vouchers:", updated); // Debug log
        return updated;
      });
      setVouchersFilter((prev) => {
        const updated = prev.filter((voucher) => voucher.id !== tableData.id);
        console.log("Updated vouchersFilter:", updated); // Debug log
        return updated;
      });

      // Clear form fields and reset tableData
      setAmount("");
      setRemarks("");
      setDate("");
      setTableData({ id: "", Reportno: "", Date: "" });

      // Fetch updated data from server to ensure consistency
      await fetchData();
    } catch (error) {
      let errorMessage = "Unknown error occurred";
      if (error.response) {
        errorMessage = `Server error: ${error.response.status} - ${error.response.data.message || JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        errorMessage = "No response from server. Is the backend running on http://localhost:3001?";
      } else {
        errorMessage = `Request error: ${error.message}`;
      }
      console.error("Error deleting voucher:", errorMessage);
      alert(`Error deleting cash voucher: ${errorMessage}`);
      // Re-fetch data in case of error to restore UI consistency
      await fetchData();
    }
  };

  return (
    <div className="box-border flex justify-between bg-gray-100">
      <div className="flex flex-col items-center flex-1 h-full p-3 mx-2 bg-gray-100 rounded-lg">
        <div className="w-full max-w-lg p-4 mb-8 text-4xl font-bold text-center border border-gray-300 rounded-lg">
          Cash Voucher
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-lg">
          <fieldset className="box-border p-2 mb-3 border border-gray-300 rounded-lg h-28">
            <legend className="mb-4 font-normal">Day Detail</legend>
            <div className="flex items-center mb-4">
              <label className="mr-4 font-normal whitespace-nowrap min-w-[120px]">
                Date:
              </label>
              <input
                type="date"
                required
                className="box-border flex-1 w-full h-8 p-2 border border-gray-300 rounded-md"
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </fieldset>
          <fieldset className="box-border p-6 mb-8 border border-gray-300 rounded-lg">
            <legend className="mb-4 font-normal">Voucher Details</legend>
            <div className="flex items-center mb-2">
              <label className="mr-4 font-normal whitespace-nowrap min-w-[120px]">
                Party Name:
              </label>
              <div className="relative flex-1">
                <select
                  required
                  className="box-border w-full h-8 p-1 border border-gray-300 rounded-md appearance-none cursor-pointer"
                  onChange={handlePartySelect}
                  value={partyName}
                >
                  <option value="">Select Party</option>
                  {parties.map((party, index) => (
                    <option key={index} value={party.Partyname}>
                      {party.Partyname}
                    </option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </span>
              </div>
            </div>
            <div className="flex items-center mb-2">
              <label className="mr-4 font-normal whitespace-nowrap min-w-[120px]">
                Amount:
              </label>
              <input
                type="number"
                required
                className="box-border flex-1 w-full h-8 p-2 border border-gray-300 rounded-md"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="flex items-center mb-2">
              <label className="mr-4 font-normal whitespace-nowrap min-w-[120px]">
                Remarks:
              </label>
              <input
                type="text"
                className="box-border flex-1 w-full h-8 p-2 border border-gray-300 rounded-md"
                pattern=".{0,}"
                title="Remarks can be empty or at least 3 characters long"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </fieldset>
          <div className="flex justify-between w-full">
            <button
              type="submit"
              className="h-8 px-6 py-1 bg-gray-300 border-none rounded-md cursor-pointer"
            >
              Add
            </button>
            <button
              type="button"
              className="h-8 px-6 py-1 bg-gray-300 border-none rounded-md cursor-pointer"
              onClick={HandleDelete}
            >
              Delete
            </button>
          </div>
        </form>
      </div>

      <div className="box-border flex flex-col items-center flex-1 p-3 mx-2 bg-gray-100 rounded-lg">
        <div className="w-full">
          <u>
            <h1 className="mb-1 text-left">
              Party: {selectedParty ? selectedParty.Partyname : "N/A"}
            </h1>
          </u>
        </div>
        <div className="w-full">
          <u>
            <h1 className="mb-2 text-left">
              City: {selectedParty ? selectedParty.City : "N/A"}
            </h1>
          </u>
        </div>
        <div className="w-full">
          <h7 className="text-left">Day Cash Details</h7>
        </div>
        <div>
          <div className="mx-auto">
            <div className="relative overflow-x-auto overflow-y-auto h-[400px] w-[430px]">
              <table className="bg-white border border-gray-300 table-auto">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    {headers.map((header, index) => (
                      <th
                        key={index}
                        className="text-sm text-left border-gray-300 whitespace-nowrap"
                        style={{
                          fontSize: "13px",
                          fontWeight: "normal",
                          width: "100px",
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vouchers.length > 0 &&
                    vouchers.map((entry) => (
                      <tr key={entry.id} onClick={() => HandleClick(entry)}>
                        <td className="pr-4 text-sm transition-colors duration-300 border border-gray-300 whitespace-nowrap hover:bg-blue-500 hover:text-white">
                          {entry.Date}
                        </td>
                        <td className="pr-4 text-sm transition-colors duration-300 border border-gray-300 whitespace-nowrap hover:bg-blue-500 hover:text-white">
                          {entry.Reportno === "null" ? "" : entry.Reportno}
                        </td>
                        <td className="pr-4 text-sm transition-colors duration-300 border border-gray-300 whitespace-nowrap hover:bg-blue-500 hover:text-white">
                          {entry.Credit}
                        </td>
                        <td className="pr-4 text-sm transition-colors duration-300 border border-gray-300 whitespace-nowrap hover:bg-blue-500 hover:text-white">
                          {entry.Debit}
                        </td>
                        <td className="pr-4 text-sm transition-colors duration-300 border border-gray-300 whitespace-nowrap hover:bg-blue-500 hover:text-white">
                          {entry.Remarks || ""}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CashVoucher;