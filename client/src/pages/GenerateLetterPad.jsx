import React, { useState } from "react";
import call1 from "../images/unclesign.png";
import call2 from "../images/sweshguptasign.png";

const GenerateLetterpad = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    { id: 1, src: call1, alt: "Signature 1", pdf: "./signature1.pdf" },
    { id: 2, src: call2, alt: "Signature 2", pdf: "./signature2.pdf" },
  ];

  const handleSelect = (event) => {
    const selectedId = parseInt(event.target.value, 10);
    const selected = images.find((image) => image.id === selectedId);
    setSelectedImage(selected);
  };

  const downloadPDF = () => {
    if (!selectedImage) {
      alert("Please select a signature before downloading the letterpad.");
      return;
    }
    const link = document.createElement("a");
    link.href = selectedImage.pdf;
    link.download = selectedImage.pdf.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white border border-gray-300 rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Generate Letterpad</h1>

        <div className="flex flex-col items-center gap-6">
          {/* Dropdown for Signature Selection */}
          <select
            className="px-4 py-2 text-sm font-medium bg-gray-200 rounded-lg"
            onChange={handleSelect}
            value={selectedImage ? selectedImage.id : ""}
          >
            <option value="" disabled>
              Select Signature
            </option>
            {images.map((image) => (
              <option key={image.id} value={image.id}>
                {image.alt}
              </option>
            ))}
          </select>

          {/* Display Selected Signature */}
          {selectedImage && (
            <div className="mt-4">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-24 h-24 border border-gray-300 rounded-lg"
              />
            </div>
          )}

          {/* Download Button */}
          <button
            type="button"
            onClick={downloadPDF}
            className="px-6 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Download Letterpad
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateLetterpad;
