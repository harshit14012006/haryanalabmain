import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";

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

const headers = [
  "Partyname",
  "Address1",
  "Address2",
  "Landmark",
  "State",
  "Pincode",
  "City",
  "District",
  "Printname",
  "Landline1",
  "Mobile1",
  "Mobile2",
  "Mobile3",
  "Mobile4",
  "Mobile5",
  "Fax",
  "Email1",
  "Email2",
  "Website",
  "Openingbalance",
  "Name",
  "Designation",
  "Mobile1c",
  "Mobile2c",
  "Remarks1",
  "Remarks2",
  "Remarks3",
];

const CustomerForm = () => {
  const [dataa, getdata] = useState([]);
  const [StateCity, setStateCity] = useState([]); // Initialize as an empty array
  const [Update, setUpdate] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [formdata, setFormdata] = useState({
    Partyname: "",
    Address1: "",
    Address2: "",
    Landmark: "",
    State: "",
    Pincode: "",
    City: "",
    District: "",
    Printname: "",
    Landline1: "",
    Mobile1: "",
    Mobile2: "",
    Mobile3: "",
    Mobile4: "",
    Mobile5: "",
    Fax: "",
    Email1: "",
    Email2: "",
    Website: "",
    Openingbalance: "",
    Name: "",
    Designation: "",
    Mobile1c: "",
    Mobile2c: "",
    Remarks1: "",
    Remarks2: "",
    Remarks3: "",
  });

  const [TempState, SetTemp] = useState([]);

  useEffect(() => {
    FetchData();
  }, []);

  const FetchData = () => {
    try {
      axios
        .get("http://localhost:3001/api/customers")
        .then((response) => {
          // Check if the response data is an array
          if (Array.isArray(response.data)) {
            getdata(response.data);
          } else {
            getdata([]); // Set to an empty array if the data is not as expected
          }
        })
        .catch((error) => {
          console.error("There was an error fetching the data!", error);
        });

      axios
        .get("http://localhost:3001/api/mastercity")
        .then((response) => {
          console.log(response.data.id);
          // Check if the response data is an array
          if (Array.isArray(response.data.id)) {
            setStateCity(response.data.id);
            SetTemp(response.data.id);
          } else {
            setStateCity([]); // Set to an empty array if the data is not as expected
          }
        })
        .catch((error) => {
          console.error("There was an error fetching the data!", error);
        });
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    const sortedData = [...dataa].sort((a, b) => {
      const nameA = a["Name"].toLowerCase();
      const nameB = b["Name"].toLowerCase();
      return newSortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
    getdata(sortedData);
    setSortOrder(newSortOrder);
  };

  const getSortIcon = () => {
    if (sortOrder === "asc") {
      return <FontAwesomeIcon icon={faSortUp} />;
    } else if (sortOrder === "desc") {
      return <FontAwesomeIcon icon={faSortDown} />;
    }
    return <FontAwesomeIcon icon={faSort} />;
  };

  const handleChange = (event) => {
    setFormdata({ ...formdata, [event.target.name]: event.target.value });
  };

  const HandleClick = (data) => {
    setFormdata(data);
    setUpdate(data);
  };

  const handleDelete = () => {
    try {
      axios
        .delete(`http://localhost:3001/api/customers/${Update.Partyid}`)
        .then((response) => {
          console.log("Data Deleted successfully:", response.data);
          FetchData(); // Refresh data after delete
        })
        .catch((error) => {
          console.error("There was an error Deleting the data!", error);
        });
      setUpdate([]);
    } catch (error) {
      console.log("Error deleting data:", error);
    }
  };

  const HandleAddData = () => {
    console.log(formdata);
    if (formdata.Name === "") {
      formdata.Name = formdata.Printname;
    }
    try {
      axios
        .post("http://localhost:3001/api/customers", formdata)
        .then((response) => {
          console.log("Data submitted successfully:", response.data);
          FetchData(); // Refresh data after adding
          // setFormdata({
          //   Partyname: "",
          //   Address1: "",
          //   Address2: "",
          //   Landmark: "",
          //   State: "",
          //   Pincode: "",
          //   City: "",
          //   District: "",
          //   Printname: "",
          //   Landline1: "",
          //   Mobile1: "",
          //   Mobile2: "",
          //   Mobile3: "",
          //   Mobile4: "",
          //   Mobile5: "",
          //   Fax: "",
          //   Email1: "",
          //   Email2: "",
          //   Website: "",
          //   Openingbalance: "",
          //   Name: "",
          //   Designation: "",
          //   Mobile1c: "",
          //   Mobile2c: "",
          //   Remarks1: "",
          //   Remarks2: "",
          //   Remarks3: "",
          // });
        })
        .catch((error) => {
          console.error("There was an error submitting the data!", error);
        });
    } catch (error) {
      console.log("Error adding data:", error);
    }
  };

  const HandleUpdate = () => {
    try {
      axios
        .put(`http://localhost:3001/api/customers/${Update.Partyid}`, formdata)
        .then((response) => {
          console.log("Data updated successfully:", response.data);
          FetchData(); // Refresh data after update
          // setFormdata({
          //   Partyname: "",
          //   Address1: "",
          //   Address2: "",
          //   Landmark: "",
          //   State: "",
          //   Pincode: "",
          //   City: "",
          //   District: "",
          //   Printname: "",
          //   Landline1: "",
          //   Mobile1: "",
          //   Mobile2: "",
          //   Mobile3: "",
          //   Mobile4: "",
          //   Mobile5: "",
          //   Fax: "",
          //   Email1: "",
          //   Email2: "",
          //   Website: "",
          //   Openingbalance: "",
          //   Name: "",
          //   Designation: "",
          //   Mobile1c: "",
          //   Mobile2c: "",
          //   Remarks1: "",
          //   Remarks2: "",
          //   Remarks3: "",
          // });
          setUpdate([]);
        })
        .catch((error) => {
          console.error("There was an error updating the data!", error);
        });
    } catch (error) {
      console.log("Error updating data:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const clickedButton = e.nativeEvent.submitter.value;
    switch (clickedButton) {
      case "Add":
        HandleAddData();
        break;
      case "Update":
        HandleUpdate();
        break;
      case "Delete":
        handleDelete();
        break;
      default:
        console.log("Unknown button clicked");
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  // Get unique cities for dropdown
  const cityOptions = [...new Set(dataa.map((row) => row.City))];

  const filteredData = dataa
    .filter((row) =>
      row.Partyname.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((row) => (selectedCity ? row.City === selectedCity : true));

  const HandleFilter = (event) => {
    console.log(TempState);
    const Data = TempState.filter((e) => e.State === event.target.value);
    console.log(Data);
    setStateCity(Data);
  };

  const handleOnChange = (e) => {
    handleChange(e); // Update the form data
    HandleFilter(e); // Filter data based on selected state
  };

  return (
    <div className="bg-gray-100">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-4">
          <div className="w-1/2 pl-2">
            {/* First div content */}
            <fieldset className="p-2 border ">
              <legend style={{ fontSize: "13px", fontWeight: "normal" }}>
                Party Name
              </legend>
              <div className="flex items-center">
                <label
                  htmlFor="partyname"
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  Party Name
                </label>
                <input
                  type="text"
                  id="partyname"
                  className="w-2/3 h-5 border"
                  required
                  name="Partyname"
                  value={formdata.Partyname}
                  onChange={handleChange}
                />
                <p
                  id="partyNameError"
                  className="absolute left-0 hidden mt-1 text-sm text-red-500 top-full"
                >
                  Please fill out this field
                </p>
              </div>
            </fieldset>
            <fieldset className="p-2 border">
              <legend style={{ fontSize: "13px", fontWeight: "normal" }}>
                Address Details
              </legend>
              {/* Address Details Inputs */}
              <div className="flex items-center mb-1 space-x-2">
                <label
                  htmlFor="address1"
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  Address 1
                </label>
                <input
                  type="text"
                  id="address1"
                  className="w-2/3 h-5 border"
                  name="Address1"
                  value={formdata.Address1}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center mb-1 space-x-2">
                <label
                  htmlFor="address2"
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  Address 2
                </label>
                <input
                  type="text"
                  id="address2"
                  className="w-2/3 h-5 border"
                  name="Address2"
                  value={formdata.Address2}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center mb-1 space-x-2">
                <label
                  htmlFor="landmark"
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  Landmark
                </label>
                <input
                  type="text"
                  id="landmark"
                  className="w-2/3 h-5 border"
                  name="Landmark"
                  value={formdata.Landmark}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center mb-1 space-x-2">
                <label
                  htmlFor="state"
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  State
                </label>
                <select
                  id="state"
                  className="w-2/3 h-5 text-sm border"
                  required
                  name="State"
                  value={formdata.State}
                  onChange={handleOnChange}
                >
                  <option value="">Select a state</option>
                  {stateName.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center mb-1 space-x-2">
                <label
                  htmlFor="pincode"
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  Pincode
                </label>
                <input
                  type="text"
                  style={{ fontSize: "14px" }}
                  id="Pincode"
                  className="w-2/3 h-5 border"
                  name="Pincode"
                  value={formdata.Pincode}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center mb-1 space-x-2">
                <label
                  htmlFor="city"
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  City
                </label>
                <select
                  id="city"
                  className="w-2/3 h-5 text-sm border"
                  required
                  name="City"
                  value={formdata.City}
                  onChange={handleChange}
                >
                  <option value="">Select a City</option>
                  {StateCity.length !== 0 &&
                    StateCity.map((item, index) => (
                      <option key={index} value={item.City}>
                        {item.City}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex items-center mb-1 space-x-2">
                <label
                  htmlFor="text"
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  District
                </label>
                <input
                  type="text"
                  id="District"
                  className="w-2/3 h-5 border"
                  name="District"
                  value={formdata.District}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center mb-1 space-x-2">
                <label
                  htmlFor="text"
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  Print Name
                </label>
                <input
                  type="text"
                  className="w-2/3 h-5 border"
                  name="Printname"
                  required
                  value={formdata.Printname}
                  onChange={handleChange}
                />
              </div>
            </fieldset>
          </div>

          <div className="w-1/2 pl-2">
            {/* Contact details content */}
            <fieldset className="p-2 border h-72">
              <legend style={{ fontSize: "13px", fontWeight: "normal" }}>
                Contact Details
              </legend>
              {/* Contact Details Inputs */}
              <div className="flex items-center mb-1 space-x-2">
                <label
                  htmlFor="Mobile1"
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  Mobile 1
                </label>
                <input
                  type="text"
                  id="moble1"
                  className="w-2/3 h-5 border"
                  name="Mobile1"
                  value={formdata.Mobile1}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center mb-1 space-x-2">
                <label
                  htmlFor="landline1"
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  Landline 1
                </label>
                <input
                  type="text"
                  id="landline1"
                  className="w-2/3 h-5 border"
                  name="Landline1"
                  value={formdata.Landline1}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center mb-1 space-x-2">
                <label
                  htmlFor="email"
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  Email 1
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-2/3 h-5 border"
                  name="Email1"
                  value={formdata.Email1}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center mb-1 space-x-2">
                <label
                  htmlFor="mobile2"
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  Mobile 2
                </label>
                <input
                  type="text"
                  id="mobile2"
                  className="w-2/3 h-5 border"
                  name="Mobile2"
                  value={formdata.Mobile2}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center mb-1 space-x-2">
                <label
                  htmlFor="mobile3"
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  Mobile 3
                </label>
                <input
                  type="text"
                  id="mobile3"
                  className="w-2/3 h-5 border"
                  name="Mobile3"
                  value={formdata.Mobile3}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center mb-1 space-x-2">
                <label
                  htmlFor="mobile4"
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  Mobile 4
                </label>
                <input
                  type="text"
                  id="mobile4"
                  className="w-2/3 h-5 border"
                  name="Mobile4"
                  value={formdata.Mobile4}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center mb-1 space-x-2">
                <label
                  htmlFor="mobile5"
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  Mobile 5
                </label>
                <input
                  type="text"
                  id="mobile5"
                  className="w-2/3 h-5 border"
                  name="Mobile5"
                  value={formdata.Mobile5}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center mb-1 space-x-2">
                <label
                  htmlFor="email"
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  Email 2
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-2/3 h-5 border"
                  name="Email2"
                  value={formdata.Email2}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center mb-1 space-x-2">
                <label
                  htmlFor="fax"
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  Fax
                </label>
                <input
                  type="text"
                  id="fax"
                  className="w-2/3 h-5 border"
                  name="Fax"
                  value={formdata.Fax}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center mb-1 space-x-2">
                <label
                  htmlFor="website"
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  Website
                </label>
                <input
                  type="text"
                  id="website"
                  className="w-2/3 h-5 border"
                  name="Website"
                  value={formdata.Website}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center mb-1 space-x-2">
                <label
                  htmlFor="opening_balance"
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  Opening Balance
                </label>
                <input
                  type="text"
                  id="opening_balance"
                  className="w-2/3 h-5 border"
                  name="Openingbalance"
                  value={formdata.Openingbalance}
                  onChange={handleChange}
                />
              </div>
            </fieldset>
          </div>
          {/* Control Panel */}
          <div className="w-1/4 pt-10 pl-2 pr-4">
            <fieldset className="p-2 border">
              <legend style={{ fontSize: "13px", fontWeight: "normal" }}>
                Control Panel
              </legend>
              <div className="flex flex-col space-y-2">
                <button
                  type="submit"
                  value="Add"
                  className="px-2 py-1 text-black bg-gray-200 rounded "
                >
                  Add
                </button>
                <button
                  type="submit"
                  value="Update"
                  className="w-full max-w-xs px-2 py-1 text-black bg-gray-200 rounded"
                >
                  Update
                </button>
                <button
                  type="submit"
                  value="Delete"
                  className="w-full max-w-xs px-2 py-1 text-black bg-gray-200 rounded"
                >
                  Delete
                </button>
                <button
                  type="submit"
                  value="Close"
                  className="w-full max-w-xs px-2 py-1 text-black bg-gray-200 rounded"
                  onClick={() => window.close()}
                >
                  Close
                </button>
              </div>
            </fieldset>
            <div className="pl-2 mt-4 text-sm">
              Total No. of Customer:{" "}
              <span className="font-semibold">{dataa.length}</span>
            </div>
          </div>
        </div>
        {/* Two new divs in a row */}
        <div className="flex pl-2 space-x-4">
          <div className="w-1/2">
            {/* Contact person details div */}
            <fieldset className="p-2 border">
              <legend style={{ fontSize: "13px", fontWeight: "normal" }}>
                Contact Person Details
              </legend>

              <div className="flex mb-2 space-x-2">
                <div className="flex w-1/2 space-x-2">
                  <label
                    htmlFor="name"
                    className="w-1/3"
                    style={{ fontSize: "13px", fontWeight: "normal" }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-2/3 h-5 border"
                    name="Name"
                    value={formdata.Name}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex w-1/2 space-x-2">
                  <label
                    htmlFor="mobile1"
                    className="w-1/3"
                    style={{ fontSize: "13px", fontWeight: "normal" }}
                  >
                    Mobile 1
                  </label>
                  <input
                    type="text"
                    id="mobile1"
                    className="w-2/3 h-5 border"
                    name="Mobile1c"
                    value={formdata.Mobile1c}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex mb-2 space-x-2">
                <div className="flex w-1/2 space-x-2">
                  <label
                    htmlFor="designation"
                    className="w-1/3"
                    style={{ fontSize: "13px", fontWeight: "normal" }}
                  >
                    Designation
                  </label>
                  <input
                    type="text"
                    id="designation"
                    className="w-2/3 h-5 border"
                    name="Designation"
                    value={formdata.Designation}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex w-1/2 space-x-2">
                  <label
                    htmlFor="mobile2"
                    className="w-1/3"
                    style={{ fontSize: "13px", fontWeight: "normal" }}
                  >
                    Mobile 2
                  </label>
                  <input
                    type="text"
                    id="mobile2"
                    className="w-2/3 h-5 border"
                    name="Mobile2c"
                    value={formdata.Mobile2c}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </fieldset>
          </div>

          <div className="w-1/2 pr-4">
            {/* Review section div */}
            <fieldset className="p-2 border">
              <legend style={{ fontSize: "13px", fontWeight: "normal" }}>
                Review
              </legend>
              <div className="flex items-center mb-1 space-x-2">
                <label
                  htmlFor=""
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  Remarks1
                </label>
                <input
                  type="text"
                  id=""
                  className="w-2/3 h-5 border"
                  name="Remarks1"
                  value={formdata.Remarks1}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center mb-1 space-x-2">
                <label
                  htmlFor=""
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  Remarks2
                </label>
                <input
                  type="text"
                  id=""
                  className="w-2/3 h-5 border"
                  name="Remarks2"
                  value={formdata.Remarks2}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center mb-1 space-x-2">
                <label
                  htmlFor=""
                  className="w-1/3"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  Remarks3
                </label>
                <input
                  type="text"
                  id=""
                  className="w-2/3 h-5 border"
                  name="Remarks3"
                  value={formdata.Remarks3}
                  onChange={handleChange}
                />
              </div>
            </fieldset>
          </div>
        </div>
      </form>

      {/* Table Content */}
      <div className="pl-2 pr-4">
        <fieldset className="p-1 border">
          <legend style={{ fontSize: "13px", fontWeight: "normal" }}>
            Party Details
          </legend>
          <div className="container mx-auto">
            <div className="relative overflow-x-auto overflow-y-auto h-[177px] w-[1200px]">
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
                          minWidth: "80px", // Set a minimum width for each cell
                        }}
                        onClick={header === "Name" ? handleSort : undefined}
                      >
                        {header} {header === "Name" && getSortIcon()}
                        {header === "Partyname" && (
                          <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-20 px-1 py-1 ml-2 text-sm border rounded"
                          />
                        )}
                        {header === "City" && (
                          <select
                            value={selectedCity}
                            onChange={handleCityChange}
                            className="w-12 py-1 ml-2 text-sm border rounded"
                          >
                            <option value="">All</option>
                            {cityOptions.map((city, i) => (
                              <option key={i} value={city}>
                                {city}
                              </option>
                            ))}
                          </select>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr
                      key={index}
                      className="transition-all border-b border-gray-300 hover:bg-blue-400 hover:text-white"
                      onClick={() => HandleClick(row)}
                    >
                      {headers.map((header, index) => (
                        <td
                          key={index}
                          className="text-sm border-2 border-gray-300 whitespace-nowrap"
                          style={{
                            fontSize: "13px",
                            fontWeight: "normal",
                            minWidth: "80px", // Set a minimum width for each cell
                          }}
                        >
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </fieldset>
      </div>

      {/* <div className="pl-2 pr-4">
      <fieldset className='p-1 border'>
    <legend style={{ fontSize: '13px', fontWeight: 'normal' }}>Party Details</legend>
    <div className="container mx-auto">
      <div className="relative overflow-x-auto overflow-y-auto max-h-[196px] w-full lg:w-[1220px]">
        <table className="min-w-full bg-white border border-gray-300 table-auto">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-sm text-left border-gray-300 whitespace-nowrap"
                  style={{ fontSize: '13px', fontWeight: 'normal', width: '100px' }}
                  onClick={header === 'Name' ? handleSort : undefined}
                >
                  {header} {header === 'Name' && getSortIcon()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="transition-colors duration-300 hover:bg-blue-500 hover:text-white">
                {headers.map((header, j) => (
                  <td
                    key={j}
                    className={`border-gray-300 border text-sm whitespace-nowrap ${j < headers.length - 1 ? 'pr-4' : ''}`}
                    style={{ width: header === 'Name' ? '200px' : '120px', fontSize: '11px' }}
                  >
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </fieldset>
      </div> */}
    </div>
  );
};

export default CustomerForm;
