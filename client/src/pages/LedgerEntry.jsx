import React, { useState, useEffect } from "react";
import axios from "axios";

function LedgerEntry() {
  const [partyNames, setPartyNames] = useState([]);
  const [selectedParty, setSelectedParty] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [ledgerEntriesFilter, setLedgerEntriesFilter] = useState([]);
  const [Repno, setRepNo] = useState([]);
  const [ledgerRepno, setledgerRepNo] = useState([]);
  const [formData, setFormData] = useState({
    Date: "",
    Reportno: "",
    PartyName: "",
    Credit: "",
    Remarks: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:3001/api/customers")
      .then((response) => {
        console.log(response.data);
        setPartyNames(response.data);
      })
      .catch((error) => {
        console.error("Error fetching party names:", error);
      });
    axios
      .get(`http://localhost:3001/api/users/`)
      .then((response) => {
        console.log("Data From HandleTableData", response.data);
        const formattedReports = response.data.map((item) => ({
          ...item,
          Date: formatDate(item.Date),
        }));
        setLedgerEntries(formattedReports);
        setLedgerEntriesFilter(formattedReports);
        const First = response.data.map((item) => item.Reportno);
        let rep = First.filter((item) => item !== "null");
        rep = rep.map((item) => Number(item));
        setledgerRepNo(rep);
      })
      .catch((error) => {
        console.error("Error fetching party names:", error);
      });
  };

  const RepNumber = (Data) => {
    try {
      axios
        .get(`http://localhost:3001/api/analysises/${Data}`)
        .then((response) => {
          console.log(response.data, " is report number");
          const repnumber = response.data.filter(
            (item) => !ledgerRepno.includes(item.Reportno)
          );
          console.log(repnumber);
          setRepNo(repnumber);
        })
        .catch((error) => {
          console.error("Error fetching party names:", error);
        });
    } catch (error) {
      console.error("Error fetching Data:", error);
    }
  };

  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }

  const handlePartyChange = (event) => {
    const selectedPartyName = event?.target?.value;
    
    if (!selectedPartyName) {
      setSelectedParty(formData.PartyName);
    } else {
      setSelectedParty(selectedPartyName);
    }

    const selectedPartyObj = partyNames.find(
      (party) => party.Partyname === selectedPartyName
    );
    if (selectedPartyObj) {
      console.log(ledgerRepno);
      setSelectedCity(selectedPartyObj.City);
      RepNumber(selectedPartyObj.Name);
      const filterledger = ledgerEntriesFilter.filter(
        (item) => item.PartyName === selectedPartyName
      );
      setLedgerEntries(filterledger);
    } else {
      setSelectedCity("");
      setLedgerEntries(ledgerEntriesFilter);
    }
  };

  const handlePartyCity = (data) => {
    const selectedPartyName = data;
    const selectedPartyObj = partyNames.find(
      (party) => party.Partyname === selectedPartyName
    );
    if (selectedPartyObj) {
      setSelectedCity(selectedPartyObj.City);
    } else {
      setSelectedCity("");
    }
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleAddNew = async () => {
    if (
      !selectedParty ||
      !formData.Date ||
      !formData.Reportno ||
      !formData.Credit
    ) {
      console.log(formData);
      return;
    }

    try {
      formData.PartyName = selectedParty;
      const newEntry = {
        Date: formatDate(formData.Date),
        Reportno: formData.Reportno,
        PartyName: selectedParty,
        Credit: formData.Credit,
        Debit: null, // Assuming Debit is null for Credit entries
        Remarks: formData.Remarks,
      };

      console.log(formData);
      await axios.post("http://localhost:3001/api/users/Credit", formData)
        .then((response) => {
          console.log(response);

          // Update ledgerEntriesFilter and ledgerEntries with the new entry
          setLedgerEntriesFilter(prev => [...prev, newEntry]);
          setLedgerEntries(prev => {
            if (selectedParty) {
              return [...prev.filter(item => item.PartyName === selectedParty), newEntry];
            }
            return [...prev, newEntry];
          });

          // Reset form fields but keep party selection
          setFormData({
            Date: "",
            Reportno: "",
            PartyName: selectedParty,
            Credit: "",
            Remarks: "",
          });
        })
        .catch((error) => {
          console.log(error);
        });

    } catch (error) {
      console.error("Error adding user:", error);
      alert("Error adding new entry");
    }
  };

  function formatDate2(dateString) {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  }

  const HandleDeleteData = async () => {
    try {
      if (
        formData.Date !== "" &&
        formData.Credit !== "" &&
        formData.PartyName !== ""
      ) {
        await axios
          .delete(
            `http://localhost:3001/api/users/${formatDate2(formData.Date)}/${
              formData.Credit
            }/${formData.PartyName}`
          )
          .then((response) => {
            console.log(response);

            // Filter out the deleted entry from both ledgerEntriesFilter and ledgerEntries
            const updatedFilter = ledgerEntriesFilter.filter(
              (entry) =>
                !(
                  entry.Date === formData.Date &&
                  entry.Credit === formData.Credit &&
                  entry.PartyName === formData.PartyName
                )
            );
            setLedgerEntriesFilter(updatedFilter);

            // Update ledgerEntries to show only the selected party's remaining entries
            if (selectedParty) {
              setLedgerEntries(
                updatedFilter.filter((item) => item.PartyName === selectedParty)
              );
            } else {
              setLedgerEntries(updatedFilter);
            }

            // Reset form fields but keep party selection
            setFormData({
              Date: "",
              Reportno: "",
              PartyName: selectedParty,
              Credit: "",
              Remarks: "",
            });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        alert("Please select a valid entry to delete.");
      }
    } catch (error) {
      console.log(error);
    }
  };


  const handleData = (data) => {
    if (data.Credit) {
      console.log(data.Credit);
      setFormData(data);
      setSelectedParty(data.PartyName);
      handlePartyCity(data.PartyName);
    } else {
      setFormData({
        Date: "",
        Reportno: "",
        PartyName: selectedParty,
        Credit: "",
        Remarks: "",
      });
      setSelectedCity("");
      setSelectedParty("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-4">
        <div className="flex items-center justify-center h-24 pb-4 mb-4 text-4xl font-bold text-center border border-gray-300">
          Ledger Entry
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <fieldset className="p-4 border rounded">
              <legend className="mb-2 text-sm font-normal">Day Details</legend>
              <div className="flex items-center space-x-4">
                <label htmlFor="date" className="w-1/3 text-sm">
                  Date
                </label>
                <input
                  type="date"
                  id="Date"
                  required
                  value={formData.Date}
                  onChange={handleInputChange}
                  className="flex-grow h-5 px-2 py-1 border"
                />
              </div>
            </fieldset>
          </div>
          <div>
            <fieldset className="p-4 border rounded">
              <legend className="mb-2 text-sm font-normal">
                Ledger Details
              </legend>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label htmlFor="partyname" className="w-1/3 text-sm">
                    Party Name
                  </label>
                  <select
                    id="PartyName"
                    required
                    value={selectedParty || formData.PartyName}
                    onChange={handlePartyChange}
                    className="flex-grow h-5 border"
                  >
                    <option value="">Select Party Name</option>
                    {partyNames.map((party, index) => (
                      <option key={index} value={party.Partyname}>
                        {party.Partyname}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <label htmlFor="reportNumber" className="w-1/3 text-sm">
                    Report No.
                  </label>
                  <select
                    id="Reportno"
                    value={formData.Reportno}
                    onChange={handleInputChange}
                    required
                    className="flex-grow h-5 border"
                  >
                    <option value="">Select Report No.</option>
                    {Repno.length > 0 &&
                      Repno.map((repo, index) => (
                        <option key={index} value={repo.Reportno}>
                          {repo.Reportno}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <label htmlFor="amount" className="w-1/3 text-sm">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="Credit"
                    value={formData.Credit}
                    onChange={handleInputChange}
                    required
                    className="flex-grow h-5 px-2 py-1 border"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label htmlFor="remarks" className="w-1/3 text-sm">
                    Remarks
                  </label>
                  <input
                    type="text"
                    id="Remarks"
                    value={formData.Remarks}
                    onChange={handleInputChange}
                    required
                    className="flex-grow h-5 px-2 py-1 border"
                  />
                </div>
              </div>
            </fieldset>
          </div>
        </form>

        <div className="mt-5">
          <fieldset className="p-4 border rounded">
            <legend className="mb-4 text-sm font-normal">Control Panel</legend>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleAddNew}
                className="h-8 p-1 px-4 bg-gray-400 rounded"
              >
                Add New
              </button>
              <button
                type="button"
                className="h-8 px-4 py-1 bg-gray-400 rounded"
                onClick={HandleDeleteData}
              >
                Delete
              </button>
            </div>
          </fieldset>
        </div>
      </div>

      <div className="flex-1 p-2">
        <fieldset className="flex flex-col w-full h-full p-4 border">
          <legend className="font-normal">Day Cash Details</legend>
          <div className="flex flex-col mb-4 space-y-2">
            <div>
              <span>Party: {selectedParty || "N/A"}</span>
            </div>
            <div>
              <span>City: {selectedCity || "N/A"}</span>
            </div>
          </div>

          <div className="mx-auto">
            <div className="relative overflow-x-auto overflow-y-auto h-[400px] w-[430px]">
              <table className="bg-white border border-gray-300 table-auto">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    {[
                      "Entry Date",
                      "Report Number",
                      "Credit",
                      "Debit",
                      "Remarks",
                    ].map((header, index) => (
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
                  {ledgerEntries.length > 0 &&
                    ledgerEntries.map((entry, i) => (
                      <tr
                        key={i}
                        onClick={() => {
                          handleData(entry);
                        }}
                      >
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
        </fieldset>
      </div>
    </div>
  );
}

export default LedgerEntry;