import React, { useState, useEffect } from "react";
import axios from "axios";
const { ipcRenderer } = window.require("electron");

const headers = ["Partyname", "Address1", "State", "City", "Mobile1", "Email1"];

const PartyDetailPrint = () => {
  const [data, setData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [firstComboBox, setFirstComboBox] = useState("");
  const [secondComboBox, setSecondComboBox] = useState("");
  const [thirdComboBox, setThirdComboBox] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/api/customersPartyName").then((response) => {
      setCustomers(response.data);
      setStates([...new Set(response.data.map((item) => item.State))]);
    });
  }, []);

  useEffect(() => {
    if (firstComboBox) {
      const filteredCities = customers
        .filter((item) => item.State === firstComboBox)
        .map((item) => item.City);
      setCities([...new Set(filteredCities)]);
      setSecondComboBox("");
      setDistricts([]);
      setThirdComboBox("");
    }
  }, [firstComboBox, customers]);

  useEffect(() => {
    if (secondComboBox) {
      const filteredDistricts = customers
        .filter((item) => item.City === secondComboBox)
        .map((item) => item.District);
      setDistricts([...new Set(filteredDistricts)]);
      setThirdComboBox("");
    }
  }, [secondComboBox, customers]);

  useEffect(() => {
    if (thirdComboBox) {
      const params = {
        state: firstComboBox,
        city: secondComboBox,
        district: thirdComboBox,
      };

      axios.post("http://localhost:3001/api/usersFindDataByCity", params).then((response) => {
        if (response) {
          setData(response.data.data);
        }
      }).catch((error) => {
        console.error("Error fetching data:", error);
      });
    }
  }, [thirdComboBox, firstComboBox, secondComboBox]);

  const HandleClick = () => {
    ipcRenderer.send("open-party-detail-report", { details: data });
  };

  return (
    <div className="bg-gray-100">
      <div className="flex justify-center min-h-screen">
        <div className="w-full max-w-4xl">
          <form>
            <fieldset className="w-full p-3 mt-5 border border-gray-300 rounded-md">
              <legend className="text-sm">Party Detail Print</legend>
              <div className="space-y-6">
                <div className="flex space-x-6">
                  <div className="flex items-center space-x-4">
                    <label className="w-24 font-medium text-right">State</label>
                    <select
                      className="w-64 h-8 p-1 border border-gray-300 rounded-md"
                      onChange={(e) => setFirstComboBox(e.target.value)}
                      value={firstComboBox}
                    >
                      <option value="">Select State</option>
                      {states.map((state, index) => (
                        <option key={index} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="w-24 font-medium text-right">City</label>
                    <select
                      className="w-64 h-8 p-1 border border-gray-300 rounded-md"
                      onChange={(e) => setSecondComboBox(e.target.value)}
                      value={secondComboBox}
                      disabled={!firstComboBox}
                    >
                      <option value="">Select City</option>
                      {cities.map((city, index) => (
                        <option key={index} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="flex items-center space-x-4">
                    <label className="w-24 font-medium text-right">District</label>
                    <select
                      className="w-64 h-8 p-1 border border-gray-300 rounded-md"
                      onChange={(e) => setThirdComboBox(e.target.value)}
                      value={thirdComboBox}
                      disabled={!secondComboBox}
                    >
                      <option value="">Select District</option>
                      {districts.map((district, index) => (
                        <option key={index} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="relative overflow-x-auto overflow-y-auto h-[360px] w-[890px] mt-3">
                <table className="min-w-full bg-white border border-gray-300 table-auto">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-300">
                      {headers.map((header, index) => (
                        <th key={index} className="text-sm text-left border-gray-300 whitespace-nowrap"
                          style={{ fontSize: "13px", fontWeight: "normal", minWidth: "150px", width: "25px" }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((row, i) => (
                        <tr key={i} className="transition-colors duration-300 hover:bg-blue-500 hover:text-white">
                          {headers.map((header, j) => (
                            <td key={j} className="text-sm border border-gray-300 whitespace-nowrap"
                              style={{ minWidth: "150px" }}
                            >
                              {row[header] ?? ""}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                       
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Print Button */}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="h-8 px-4 py-1 bg-gray-400 rounded-md"
                  onClick={HandleClick}
                  disabled={data.length === 0}
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

export default PartyDetailPrint;
