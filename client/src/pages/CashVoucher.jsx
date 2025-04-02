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
    Reportno: "",
    Date: "",
  });

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/customers");
      setParties(response.data);

      const response2 = await axios.get("http://localhost:3001/api/users/");
      if (response2) {
        const formattedReports = response2.data.map((item) => ({
          ...item,
          Date: formatDate(item.Date),
        }));
        setVouchers(formattedReports);
        setVouchersFilter(formattedReports);
      } else {
        setVouchers([]);
      }
    } catch (error) {
      console.error("Error fetching parties:", error);
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
      Remarks: remarks,
    };

    console.log(newVoucher);
    try {
      if (newVoucher.Date && newVoucher.PartyName && newVoucher.Debit) {
        const response = await axios.post("http://localhost:3001/api/users/Debit", newVoucher);
        console.log("API Response:", response.data);

        const formattedNewVoucher = {
          ...newVoucher,
          Date: formatDate(newVoucher.Date),
          Credit: null,
        };

        setVouchersFilter((prev) => [...prev, formattedNewVoucher]);
        setVouchers((prev) => [...prev, formattedNewVoucher]);

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
      setDate(data.Date);
      setAmount(data.Debit);
      setRemarks(data.Remarks);
      setTableData({
        Reportno: data.Reportno,
        Date: data.Date,
      });
    }
  };

  const HandleDelete = async () => {
    try {
      if (tableData.Date && amount && partyName) {
        const response = await axios.delete(
          `http://localhost:3001/api/users/${formatDate2(tableData.Date)}/${amount}/${partyName}`
        );
        console.log("Delete successful:", response.data);

        const updatedFilter = vouchersFilter.filter(
          (voucher) =>
            !(
              voucher.Date === tableData.Date &&
              voucher.Debit === amount &&
              voucher.PartyName === partyName
            )
        );

        setVouchersFilter(updatedFilter);
        setVouchers(
          partyName
            ? updatedFilter.filter((item) => item.PartyName === partyName)
            : updatedFilter
        );

        setAmount("");
        setRemarks("");
        setDate("");
        setTableData({ Reportno: "", Date: "" });
      } else {
        alert("Please select a valid entry to delete.");
      }
    } catch (error) {
      console.error("Error deleting voucher:", error);
      alert("Error deleting cash voucher");
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
                pattern=".{3,}"
                title="Remarks should be at least 3 characters long"
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
                    vouchers.map((entry, i) => (
                      <tr key={i} onClick={() => HandleClick(entry)}>
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
                          {entry.Remarks}
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