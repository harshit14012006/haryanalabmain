import React, { useState, useEffect } from "react";
import axios from "axios";
// State and City data to be displayed in the table and dropdown

const stateName = [
  "Andhra_Pradesh",
  "Arunachal_Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal_Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya_Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil_Nadu",
  "Telangana",
  "Tripura",
  "Uttar_Pradesh",
  "Uttarakhand",
  "West_Bengal",
];

// const states = [...new Set(itemData.map((item) => item.name))]; // Extract unique state names

const MasterCity = () => {
  const [data, setData] = useState([]);
  const [hoveredCell, setHoveredCell] = useState({ row: null, column: null });
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [Update, getUpdate] = useState([]);

  useEffect(() => {
    FetchData();
  }, []);

  const FetchData = () => {
    axios
      .get("http://localhost:3001/api/mastercity")
      .then((response) => {
        console.log(response.data.id);
        setData(response.data.id);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  const handleMouseEnter = (rowIndex, columnIndex) => {
    setHoveredCell({ row: rowIndex, column: columnIndex });
  };

  const handleMouseLeave = () => {
    setHoveredCell({ row: null, column: null });
  };

  const handleCityClick = (data) => {
    setSelectedCity(data.City);
    setSelectedState(data.State);
    getUpdate(data);
  };

  const HandleClick = (event) => {
    event.preventDefault();
    if (!selectedCity) {
      console.log("No ItemName");
      return;
    }
    const data = {
      city: selectedCity,
      state: selectedState,
    };
    console.log(data);
    axios
      .post("http://localhost:3001/api/mastercity", data)
      .then((response) => {
        console.log("Data submitted successfully:", response.data);
      })
      .catch((error) => {
        console.error("There was an error submitting the data!", error);
      });
    FetchData();
    setSelectedState("");
    setSelectedCity("");
  };

  const HandleDelete = () => {
    console.log("HandleDelete works");
    try {
      axios
        .delete(`http://localhost:3001/api/mastercity/${Update.ID}`)
        .then((response) => {
          console.log("Data Deleted successfully:", response.data);
        })
        .catch((error) => {
          console.error("There was an error Deleting the data!", error);
        });
      FetchData();
      setSelectedState("");
      setSelectedCity("");
    } catch (error) {
      console.log("Error deleting data:", error);
    }
  };

  const HandleUpdate = () => {
    try {
      if (selectedCity !== Update.City) {
        console.log("If works");
        axios
          .put("http://localhost:3001/api/mastercity", {
            State: selectedState,
            city: selectedCity,
            id: Update.ID,
          })
          .then((response) => {
            console.log("Data Updated successfully:", response.data);
            FetchData();
          })
          .catch((error) => {
            console.error("There was an error Updating the data!", error);
          });
        setSelectedState("");
        setSelectedCity("");
        getUpdate([]);
      } else {
        console.log("else works");
        setSelectedState("");
        setSelectedCity("");
      }
    } catch (error) {
      console.log("Error updating data:", error);
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="flex justify-center items-center min-h-screen">
        <fieldset className="border border-gray-300 p-4 rounded-md w-full max-w-lg">
          <legend className="px-2">City</legend>
          <form>
            {/* State Dropdown */}
            <div className="flex items-center space-x-14 mb-4">
              <label
                htmlFor="stateName"
                className="text-gray-700 whitespace-nowrap"
              >
                State:
              </label>
              <select
                id="stateName"
                name="stateName"
                className="border border-gray-300 rounded-md h-8 flex-grow focus:outline-none"
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  console.log(e.target.value);
                }}
                required
              >
                <option value="">Select State</option>
                {stateName.map((state, index) => (
                  <option
                    key={index}
                    value={state}
                    // onChange={handleChangeOption(state)}
                  >
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* City Input */}
            <div className="flex items-center space-x-4 mb-4">
              <label
                htmlFor="cityName"
                className="text-gray-700 whitespace-nowrap"
              >
                City Name:
              </label>
              <input
                type="text"
                id="cityName"
                name="cityName"
                className="border border-gray-300 rounded-md h-8 p-2 flex-grow focus:outline-none"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between mb-4">
              <button
                type="submit"
                className="bg-gray-300 py-1 px-4 rounded-md h-8"
                onClick={(e) => HandleClick(e)}
              >
                Add
              </button>
              <button
                type="button"
                className="bg-gray-300 py-1 px-4 rounded-md h-8"
                onClick={HandleUpdate}
              >
                Update
              </button>
              <button
                type="button"
                className="bg-gray-300 py-1 px-4 rounded-md h-8"
                onClick={HandleDelete}
              >
                Delete
              </button>
            </div>

            {/* Table */}
            <div className="relative max-h-64 overflow-auto">
              <table className="min-w-full border border-black divide-y divide-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-black px-4 py-3 text-left text-xs font-medium text-black  tracking-wider">
                      Item ID
                    </th>
                    <th className="border border-black px-4 py-3 text-left text-xs font-medium text-black  tracking-wider">
                      State
                    </th>
                    <th className="border border-black px-4 py-3 text-left text-xs font-medium text-black  tracking-wider">
                      City
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item, rowIndex) => (
                    <tr key={item.ID} onClick={() => handleCityClick(item)}>
                      <td
                        onMouseEnter={() => handleMouseEnter(rowIndex, 0)}
                        onMouseLeave={handleMouseLeave}
                        className={`border border-black px-2 py-1 text-xs whitespace-nowrap ${
                          hoveredCell.row === rowIndex &&
                          hoveredCell.column === 0
                            ? "bg-blue-500 text-white"
                            : "text-black"
                        }`}
                      >
                        {item.ID}
                      </td>
                      <td
                        onMouseEnter={() => handleMouseEnter(rowIndex, 1)}
                        onMouseLeave={handleMouseLeave}
                        className={`border border-black px-2 py-1 text-xs whitespace-nowrap ${
                          hoveredCell.row === rowIndex &&
                          hoveredCell.column === 1
                            ? "bg-blue-500 text-white"
                            : "text-black"
                        }`}
                      >
                        {item.State}
                      </td>
                      <td
                        onMouseEnter={() => handleMouseEnter(rowIndex, 2)}
                        onMouseLeave={handleMouseLeave}
                        className={`border border-black px-2 py-1 text-xs whitespace-nowrap ${
                          hoveredCell.row === rowIndex &&
                          hoveredCell.column === 2
                            ? "bg-blue-500 text-white"
                            : "text-black"
                        }`}
                      >
                        {item.City}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <span className="text-gray-700 text-sm font-medium">
                Total No. of Items: {data.length}
              </span>
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default MasterCity;
