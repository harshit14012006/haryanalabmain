import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateItem = () => {
  const [hoveredCell, setHoveredCell] = useState({ row: null, column: null });
  const [ItemName, setItemName] = useState("");
  const [Data, getData] = useState([]);
  const [Update, getUpdate] = useState([]);

  const handleMouseEnter = (rowIndex, columnIndex) => {
    setHoveredCell({ row: rowIndex, column: columnIndex });
  };

  const handleMouseLeave = () => {
    setHoveredCell({ row: null, column: null });
  };

  const handleChange = (event) => {
    setItemName(event.target.value);
  };

  useEffect(() => {
    FetchApi();
  }, []);

  const FetchApi = () => {
    axios
      .get("http://localhost:3001/api/Item")
      .then((response) => {
        console.log(response.data.id);
        getData(response.data.id);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  const HandleClick = (event) => {
    event.preventDefault();
    if (!ItemName) {
      console.log("No ItemName");
      return;
    }
    const data = {
      name: ItemName,
      date: new Date().toISOString().slice(0, 10),
    };
    console.log(data);
    axios
      .post("http://localhost:3001/api/Item", data)
      .then((response) => {
        console.log("Data submitted successfully:", response.data);
      })
      .catch((error) => {
        console.error("There was an error submitting the data!", error);
      });
    FetchApi();
    setItemName("");
  };

  const HandleData = (data) => {
    // console.log("Hello by clicking button = ", data);
    setItemName(data.ItemName);
    getUpdate(data);
  };

  const HandleUpdate = () => {
    if (ItemName !== Update.ItemName) {
      console.log("If works");
      axios
        .put("http://localhost:3001/api/Item", {
          name: ItemName,
          id: Update.ID,
        })
        .then((response) => {
          console.log("Data submitted successfully:", response.data);
          FetchApi();
        })
        .catch((error) => {
          console.error("There was an error submitting the data!", error);
        });
      setItemName("");
      getUpdate([]);
    } else {
      console.log("else works");
      setItemName("");
    }
  };

  const HandleDelete = () => {
    try {
      axios
        .delete(`http://localhost:3001/api/Item/${Update.ID}`)
        .then((response) => {
          console.log("Data deleted successfully:", response.data);
          FetchApi();
        })
        .catch((error) => {
          console.error("There was an error deleting the data!", error);
        });
      getUpdate([]);
      setItemName("");
    } catch (error) {
      console.error("There was an error deleting the data!", error);
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="flex items-center justify-center min-h-screen">
        <fieldset className="w-full max-w-lg p-4 border border-gray-300 rounded-md">
          <legend className="px-2 ">Create Item</legend>
          <form>
            <div className="flex items-center mb-4 space-x-4">
              <label
                htmlFor="itemName"
                className="text-gray-700 whitespace-nowrap"
              >
                Item Name:
              </label>
              <input
                type="text"
                id="itemName"
                name="ItemName"
                className="flex-grow h-8 p-2 border border-gray-300 rounded-md focus:outline-none"
                required
                value={ItemName}
                onChange={(event) => handleChange(event)}
                minLength="3"
                maxLength="50"
              />
            </div>
            <div className="flex justify-between mb-4">
              <button
                // type="submit"
                className="px-4 py-1 bg-gray-300 rounded-md "
                onClick={HandleClick}
              >
                Add
              </button>
              <button
                type="button"
                className="px-4 py-1 bg-gray-300 rounded-md "
                onClick={HandleUpdate}
              >
                Update
              </button>
              <button
                type="button"
                className="px-4 py-1 bg-gray-300 rounded-md "
                onClick={HandleDelete}
              >
                Delete
              </button>
            </div>
            <div className="relative overflow-auto max-h-64">
              <table className="min-w-full border border-black divide-y divide-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-black  border border-black">
                      Item Id
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-black  border border-black">
                      Item Name
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-black  border border-black">
                      Insert Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Data.map((sample, rowIndex) => (
                    <tr key={sample.ID} onClick={() => HandleData(sample)}>
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
                        {sample.ID}
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
                        {sample.ItemName}
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
                        {new Date(sample.Date)
                          .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          })
                          .replace(/\//g, "-")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <span className="text-sm font-medium text-gray-700">
                Total No. of Items: {Data.length}
              </span>
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default CreateItem;
