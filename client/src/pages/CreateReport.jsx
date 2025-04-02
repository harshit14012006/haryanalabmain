import React, { useState, useEffect } from "react";
import axios from "axios";
import call1 from "../images/unclesign.png";
import call2 from "../images/sweshguptasign.png";
const { ipcRenderer } = window.require("electron"); // Import ipcRenderer

const CreateReport = () => {
  const [ffaTime, setFfaTime] = useState(null);
  const [sampleName, setSampleName] = useState(null);
  const [customersbyname, setCustomersbyname] = useState(null);
  const [City, setCity] = useState("");
  const [id, setId] = useState(null);
  const [time, setTime] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const handleFfaChange = (e) => {
    setFfaTime(new Date().toLocaleTimeString()); // Set the current time
    const hours = String(new Date().getHours()).padStart(2, "0");
    const minutes = String(new Date().getMinutes()).padStart(2, "0");
    e.target.value ? setTime(`${hours}:${minutes}`) : setTime(null);
  };
  const [formData, setFormData] = React.useState({
    Reportno: 0,
    Samplename: "NA",
    Dated: "NA",
    Selected: "Sealed",
    From: "NA",
    Billeddate: "NA",
    Station: "NA",
    Time: "NA",
    AnotherName: "NA",
    AnotherValue: "NA",
    Moisture: "NA",
    Oil: "NA",
    FFA: "NA",
    Code: "NA",
    Date: "NA",
    Vechileno: "NA",
    Bags: "NA",
    Weight: "NA",
    Itemcategory: "Seal Engraved",
    SealEngraved: "NA",
    Remarks: "NA",
    Signature: "NA",
  });

  const images = [
    { id: 1, src: call1, alt: "Signature 1", value: "signature1" },
    { id: 2, src: call2, alt: "Signature 2", value: "signature2" },
  ];

  const [selectedImage, setSelectedImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (image) => {
    console.log(image);
    setSelectedImage(image);
    setIsOpen(false); // Close dropdown after selecting
    setFormData({ ...formData, Signature: image.value });
    image.value && setIsDisabled(!isDisabled);
  };

  const handleChange = (event) => {
    console.log(event.target.value);
    // Create a new object with the updated formData
    let newFormData = { ...formData, [event.target.name]: event.target.value };

    // Check if 'From' field matches any customer name
    if (event.target.name === "From") {
      const result = customersbyname.find(
        (person) =>
          person.Name.toLowerCase() === event.target.value.toLowerCase()
      );

      if (result) {
        console.log("Found");
        setCity(result.City); // Set city state if a match is found
        newFormData = { ...newFormData, Station: result.City }; // Update newFormData with Station
      } else {
        console.log("not found");
        newFormData.Station = ""; // Clear Station if not found
      }
    }

    // Update formData with the final values
    setFormData(newFormData);
  };

  useEffect(() => {
    FetchData();
    getReportno();
  }, []);

  const FetchData = () => {
    //Fetching Sample Name
    axios
      .get("http://localhost:3001/api/Item")
      .then((response) => {
        // console.log(response.data.id);
        setSampleName(response.data.id);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });

    //Fetching Customer data
    axios
      .get("http://localhost:3001/api/customersbyname")
      .then((response) => {
        // console.log(response.data);
        setCustomersbyname(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  const getReportno = () => {
    axios
      .get("http://localhost:3001/api/analysis")
      .then((response) => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        // Create a date for March 31st of the current year
        const sessionEndDate = new Date(currentYear, 2, 31); // March is month 2 (0-indexed)
        if (currentDate > sessionEndDate) {
          setId(1);
        } else {
          setId(response.data.data[0].Reportno + 1);
        }
        console.log(response.data.data[0].Reportno);
        setId(response.data.data[0].Reportno + 1);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  function formatDate(dateString) {
    if (!dateString || dateString === "NA") return "NA";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  }

  const handleSaveAndPrint = (e) => {
    console.log("called");
    e.preventDefault();
    if (isDisabled) return;
  
    try {
      // Update the formData with the current ID and formatted dates
      const updatedFormData = {
        ...formData,
        Reportno: id,
        Dated: formatDate(formData.Dated),
        Billeddate: formatDate(formData.Billeddate),
      };
  
      console.log(updatedFormData);
  
      // Submit the updated form data
      axios
        .post("http://localhost:3001/api/analysis", updatedFormData)
        .then((response) => {
          console.log("Data submitted successfully:", response.data);
  
          // Send the event to the main process for printing
          ipcRenderer.send("open-lab-report", updatedFormData);
  
          // Reset only the necessary fields
          // setFormData((prevFormData) => ({
          //   ...prevFormData, // Keep the existing form data
          //   Reportno: 0, // Reset Reportno
          //   Selected: "Sealed", // Reset Selected
          //   AnotherName: "NA", // Reset AnotherName
          //   AnotherValue: "NA", // Reset AnotherValue
          //   Moisture: "NA", // Reset Moisture
          //   Oil: "NA", // Reset Oil
          //   FFA: "NA", // Reset FFA
          //   Code: "NA", // Reset Code
          //   Date: "NA", // Reset Date
          //   Vechileno: "NA", // Reset Vechileno
          //   Bags: "NA", // Reset Bags
          //   Weight: "NA", // Reset Weight
          //   SealEngraved: "NA", // Reset SealEngraved
          //   Remarks: "NA", // Reset Remarks
          //   Signature: "NA", // Reset Signature
          // }));
  
          // Fetch the next report number
          getReportno();
  
          // Reset other states
          // setCity("");
          // setSelectedImage(null);
          setIsOpen(false);
          setTime(null);
          setIsDisabled(true);
        })
        .catch((error) => {
          console.error("There was an error submitting the data!", error);
        });
    } catch (error) {
      console.log("Error adding data:", error);
    }
  };
  return (
    <div className="bg-gray-100">
      <div className="p-1 ">
        <form >
          <fieldset className="p-2 border border-gray-300 rounded">
            <header className="text-sm">Analysis</header>
            <div className="border border-gray-300 ">
              <div className="text-center">
                <label htmlFor="reportno" className="block mb-2 text-sm">
                  Report No.
                </label>
                <input
                  type="number"
                  required
                  id="reportno"
                  value={id}
                  disabled
                  className="w-40 h-5 border bg-slate-50"
                />
              </div>
              <div className="flex ">
                {/* First container with labels and inputs in rows */}
                <div className="w-1/2 p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center">
                      <label htmlFor="samplename" className="w-1/3 text-sm">
                        Sample Name
                      </label>
                      <select
                        id="samplename"
                        className="flex-grow h-5 border rounded"
                        name="Samplename"
                        required
                        value={formData.Samplename}
                        onChange={handleChange}
                      >
                        <option value="NA">Select a sample</option>
                        {sampleName &&
                          sampleName.map((name) => {
                            return (
                              <option key={name.ID} value={name.ItemName}>
                                {name.ItemName}
                              </option>
                            );
                          })}
                      </select>
                    </div>

                    <div className="flex items-center">
                      <label htmlFor="input2" className="w-1/3 text-sm">
                        Dated
                      </label>
                      <input
                        type="date"
                        id="dated"
                        className="flex-grow h-5 py-1 border"
                        placeholder="Input 2"
                        name="Dated"
                        value={formData.Dated !== "NA" ? formData.Dated : ""}
                        required
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex items-center">
                      <label htmlFor="from" className="w-1/3 text-sm">
                        From Sh/M/s
                      </label>
                      <select
                        id="from"
                        className="flex-grow h-5 px-0 border rounded"
                        name="From"
                        value={formData.From !== "NA" ? formData.From : "NA"}
                        required
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      >
                        <option value="NA">Select an option</option>
                        {customersbyname &&
                          customersbyname.map((name, index) => {
                            return (
                              <option key={index} value={name.Name}>
                                {name.Name}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Second container with labels and inputs in rows */}
                <div className="w-1/2 p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center">
                      <label htmlFor="billeddate" className="w-1/3 text-sm">
                        Billed Date
                      </label>
                      <input
                        type="date"
                        id="billedDate"
                        required
                        value={
                          formData.Billeddate !== "NA"
                            ? formData.Billeddate
                            : ""
                        }
                        className="flex-grow h-5 px-0 py-1 border"
                        name="Billeddate"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex items-center">
                      <label
                        htmlFor="sealed-unsealed"
                        className="w-1/3 text-sm"
                      >
                        Sealed/Unsealed
                      </label>
                      <select
                        id="sealed-unsealed"
                        className="flex-grow h-5 px-0 border"
                        name="Selected"
                        required
                        value={formData.Selected}
                        onChange={handleChange}
                      >
                        <option value="sealed">Sealed</option>
                        <option value="unsealed">Unsealed</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <label htmlFor="station" className="w-1/3 text-sm">
                        Station
                      </label>
                      <input
                        type="text"
                        id="input6"
                        disabled
                        className="flex-grow h-5 px-0 py-1 border"
                        value={City}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-12 p-4 mt-1 border border-gray-300">
              <div className="flex space-x-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    id="anotherName"
                    className="h-5 px-0 py-1 border w-28"
                    value={formData.AnotherName}
                    name="AnotherName"
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    id="anotherValue"
                    className="h-5 px-0 py-1 border w-28"
                    value={formData.AnotherValue}
                    name="AnotherValue"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center pl-12">
                  <label
                    htmlFor="moisture"
                    className="text-sm whitespace-nowrap"
                  >
                    Moisture
                  </label>
                  <input
                    type="text"
                    id="moisture"
                    className="h-5 px-0 py-1 ml-2 border w-28"
                    name="Moisture"
                    value={formData.Moisture}
                    onChange={handleChange}
                  />
                  <span className="ml-1">%</span>
                </div>
                <div className="flex items-center pl-16 space-x-2">
                  <label htmlFor="oil" className="text-sm">
                    Oil
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      id="oil"
                      className="h-5 px-0 py-1 border w-28"
                      name="Oil"
                      value={formData.Oil}
                      onChange={handleChange}
                    />
                    <span className="ml-1">%</span>
                  </div>
                </div>
                <div className="flex items-center pl-16 space-x-2">
                  <label htmlFor="ffa" className="text-sm">
                    FFA
                  </label>
                  <input
                    type="text"
                    id="ffa"
                    className="h-5 px-0 py-1 border w-28"
                    name="FFA"
                    value={formData.FFA}
                    onChange={(e) => {
                      handleFfaChange(e);
                      handleChange(e);
                    }}
                  />
                  <span className="ml-1">%</span>
                </div>

                {/* Time input after FFA section, shown conditionally */}
                {time && (
                  <div className="flex items-center pl-6 space-x-2">
                    <label htmlFor="ffaTime" className="text-sm">
                      Time
                    </label>
                    <input
                      type="time"
                      id="ffaTime"
                      className="h-5 px-0 py-1 border w-28"
                      name="Time"
                      value={formData.Time === "NA" ? time : formData.Time}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="h-16 p-2 mt-1 border border-gray-300">
              <div className="flex flex-wrap -mx-4">
                {/* Code/Sample No. */}
                <div className="w-1/5 px-4 ">
                  <label
                    htmlFor="sampleNo"
                    className="block mb-1 text-sm text-center "
                  >
                    Code/Sample No.
                  </label>
                  <input
                    type="text"
                    id="sampleNo"
                    className="w-full h-5 px-0 py-1 border"
                    name="Code"
                    value={formData.Code}
                    onChange={handleChange}
                  />
                </div>

                {/* Date */}
                <div className="w-1/5 px-4 mb-4">
                  <label
                    htmlFor="date"
                    className="block mb-1 text-sm text-center "
                  >
                    Date
                  </label>
                  <input
                    type="text"
                    id="date"
                    className="w-full h-5 px-0 py-1 border"
                    name="Date"
                    value={formData.Date}
                    onChange={handleChange}
                  />
                </div>

                {/* Vehicle No. */}
                <div className="w-1/5 px-4 mb-4">
                  <label
                    htmlFor="vehicleNo"
                    className="block mb-1 text-sm text-center "
                  >
                    Vehicle No.
                  </label>
                  <input
                    type="text"
                    id="vehicleNo"
                    className="w-full h-5 px-0 py-1 border"
                    name="Vechileno"
                    value={formData.Vechileno}
                    onChange={handleChange}
                  />
                </div>

                {/* Bags */}
                <div className="w-1/5 px-4 mb-4">
                  <label
                    htmlFor="bags"
                    className="block mb-1 text-sm text-center "
                  >
                    Bags
                  </label>
                  <input
                    type="text"
                    id="bags"
                    className="w-full h-5 px-0 py-1 border"
                    name="Bags"
                    value={formData.Bags}
                    onChange={handleChange}
                  />
                </div>

                {/* Weight(Ql) */}
                <div className="w-1/5 px-4 mb-4">
                  <label
                    htmlFor="weight"
                    className="block mb-1 text-sm text-center "
                  >
                    Weight (Ql)
                  </label>
                  <input
                    type="text"
                    id="weight"
                    className="w-full h-5 px-0 py-1 border"
                    name="Weight"
                    value={formData.Weight}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="grid w-3/4 grid-cols-2 gap-4 p-4 mt-2">
              {/* Row 1, Column 1 */}
              <div>
                <select
                  id="sealed-unsealed"
                  className="flex-grow h-5 px-0 border"
                  name="Itemcategory"
                  onChange={handleChange}
                  value={formData.Itemcategory}
                >
                  <option value="Seal Engraved">Seal Engraved</option>
                  <option value="Buyer">Buyer</option>
                  <option value="Seller">Seller</option>
                  <option value="Rice Mills">Rice Mills</option>
                  <option value="Trader">Trader</option>
                  <option value="Broker">Broker</option>
                </select>
              </div>

              {/* Row 1, Column 2 */}
              <div>
                <input
                  type="text"
                  id="space"
                  className="w-full h-5 px-0 py-1 border"
                  name="SealEngraved"
                  value={formData.SealEngraved || "NA"}
                  onChange={handleChange}
                />
              </div>

              {/* Row 2, Column 1 */}
              <div>
                <span>Remarks</span>
              </div>

              {/* Row 2, Column 2 */}
              <div>
                <input
                  type="text"
                  id="space2"
                  className="w-full h-5 px-0 py-1 border"
                  name="Remarks"
                  value={formData.Remarks || "NA"}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="text-right">
              <span className="block mr-6 text-sm">Signature</span>
              <div className="flex items-center justify-end gap-2 my-3">
                {/* Selected Image */}
                <div className="absolute left-[62rem] top-[28.5rem]">
                  {selectedImage && (
                    <img
                      src={selectedImage.src}
                      alt={selectedImage.alt}
                      className="w-24 h-24 rounded-lg"
                    />
                  )}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="px-4 py-2 bg-gray-200 rounded-lg"
                  >
                    Select Image
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 z-10 w-32 mb-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-md bottom-full">
                      {images.map((image) => (
                        <div
                          key={image.id}
                          className="flex items-center justify-center p-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSelect(image)}
                        >
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-12 h-12 rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* <select
              id="signature"
              className="px-0 py-1 mb-2 border"
              name="Signature"
              onChange={handleChange}
            >
              <option value=""></option>
              <option value="signature1">Signature 1</option>
              <option value="signature2">Signature 2</option>
              <option value="signature3">Signature 3</option>
            </select> */}
              <div className="flex justify-end">
                <button type="button" className="px-2 py-1 bg-gray-400 rounded" onClick={handleSaveAndPrint}>
                  Save and Print
                </button>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default CreateReport;
