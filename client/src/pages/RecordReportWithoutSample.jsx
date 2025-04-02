import React, { useState, useEffect } from "react";
import axios from "axios";
const { ipcRenderer } = window.require("electron");

const headers = [
  "Reportno",
  "Samplename",
  "Billeddate",
  "Dated",
  "Selected",
  "From",
  "Station",
  "AnotherName",
  "AnotherValue",
  "Moisture",
  "Oil",
  "FFA",
  "Time",
  "Code",
  "Date",
  "Vechileno",
  "Bags",
  "Weight",
  "Category",
  "SealEngaved",
  "Remarks",
  "Signature",
];

const RecordReportWithoutSample = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [partyName, setPartyName] = useState("");
  const [city, setCity] = useState("");
  const [records, setRecords] = useState([]);
  const [customers, setCustomers] = useState([]);
  const fetchRecords = async () => {
    try {
      // Clear previous error

      // Prepare the payload
      const payload = {
        startDate,
        endDate,
        partyName,
      };
      console.log(payload);
      // Send POST request to the API
      if (
        payload.startDate !== "" &&
        payload.endDate !== "" &&
        payload.partyName !== ""
      )
        await axios
          .post("http://localhost:3001/api/analysisPartyname", payload)
          .then((response) => {
            if (response) {
              console.log(response.data);
              setRecords(response.data);
            }
          })
          .catch((err) => console.log(err.response.data));

      // Set the records in state if response is successful
    } catch (err) {
      console.error("Error fetching records:", err.message);
    }
  };

  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }

  // Fetch customer data
  useEffect(() => {
    try {
      //Fetching Customer PartyName
      axios
        .get("http://localhost:3001/api/customersPartyName")
        .then((response) => {
          console.log(response.data);
          setCustomers(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);
  const handleChange = (event) => {
    // Create a new object with the updated formData

    const result = customers.find(
      (person) => person.Name.toLowerCase() === event.target.value.toLowerCase()
    );

    if (result) {
      console.log("Found");
      setCity(result.City);
    } else {
      console.log("not found");
    }
  };

  const HandlePdf = async () => {
    const Data = {
      Records: records,
      City: city,
      PartyName: partyName,
    };
    console.log(Data);
    Data.Records.length > 0 &&
      Data.City !== "" &&
      Data.PartyName !== "" &&
      ipcRenderer.send("open-Party-report", Data);
  };
  return (
    <div className="bg-gray-100">
      <div className="flex justify-center min-h-screen">
        <div className="w-full max-w-4xl">
          <form>
            <fieldset className="w-full p-3 mt-3 border border-gray-300 rounded-md">
              <legend className="text-sm">Reprint</legend>
              <div className="flex justify-center space-x-14">
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-col space-y-4">
                    {/* Enter No. Input */}
                    <div className="flex items-center space-x-10 whitespace-nowrap">
                      {/* From Label and Date Input */}
                      <label htmlFor="fromDate" className="font-medium">
                        From
                      </label>
                      <input
                        type="date"
                        id="fromDate"
                        name="fromDate"
                        className="h-8 p-2 border border-gray-300 rounded-md"
                        onChange={(e) => {
                          setStartDate(formatDate(e.target.value));
                        }}
                        // onChange={(e) => {
                        //   HandleChange(e);
                        // }}
                      />
                      {/* From Label and Date Input */}
                      <label htmlFor="fromDate" className="font-medium">
                        To
                      </label>
                      <input
                        type="date"
                        id="fromDate"
                        name="toDate"
                        className="h-8 p-2 border border-gray-300 rounded-md"
                        onChange={(e) => {
                          setEndDate(formatDate(e.target.value));
                        }}
                        // onChange={(e) => {
                        //   HandleChange(e);
                        // }}
                      />
                    </div>

                    {/* Fieldset for Search */}
                    <fieldset className="border border-gray-300 p-4 rounded-md">
                      <legend className="font-medium">Search</legend>

                      {/* Flex Container for Labels and Dropdowns */}
                      <div className="flex space-x-6">
                        {/* Party Name Dropdown */}
                        <div className="flex flex-col">
                          <label
                            htmlFor="partyName"
                            className="font-medium mb-2"
                          >
                            Party Name
                          </label>
                          <select
                            id="partyName"
                            name="partyName"
                            className="h-8 p-1 w-52 border border-gray-300 rounded-md"
                            onChange={(e) => {
                              setPartyName(e.target.value);
                              handleChange(e);
                            }}
                          >
                            <option value="">Select Party</option>
                            {customers &&
                              customers.map((item, index) => (
                                <option key={index} value={item.Name}>
                                  {item.PartyName}
                                </option>
                              ))}
                            {/* Add more options as needed */}
                          </select>
                        </div>

                        {/* Another Dropdown Example (e.g., Sample) */}
                        <div className="mt-8">
                          <label htmlFor="SampleName" className="font-medium">
                            City: {city}
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>

                  {/* Buttons for Display and Print */}
                  <div className="flex space-x-80 mt-10">
                    <button
                      type="button"
                      className="bg-gray-400 py-1 px-4 rounded-md h-8"
                      onClick={fetchRecords}
                    >
                      Display
                    </button>
                    <button
                      type="button"
                      className="bg-gray-400 py-1 px-4 rounded-md h-8"
                      onClick={HandlePdf}
                    >
                      Print
                    </button>
                  </div>
                </div>
              </div>
              {/* table grid */}
              <div className="relative overflow-x-auto overflow-y-auto h-[290px] w-[870px] mt-3">
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
                            minWidth: "150px", // Set minimum width for headers
                            width: "100px",
                          }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records &&
                      records.map((row, i) => (
                        <tr
                          key={i}
                          className="transition-colors duration-300 hover:bg-blue-500 hover:text-white"
                        >
                          {headers.map((header, j) => (
                            <td
                              key={j}
                              className={`border-gray-300 border text-sm whitespace-nowrap ${
                                j < headers.length - 1 ? "pr-0" : ""
                              }`}
                              style={{ minWidth: "150px" }} // Set minimum width for data cells
                            >
                              {row[header]}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecordReportWithoutSample;
