import React, { useState } from "react";
import call1 from "../images/unclesign.png";
import call2 from "../images/sweshguptasign.png";
import axios from "axios";
const { ipcRenderer } = window.require("electron");

const GenerateLetterpad = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [letterContent, setLetterContent] = useState("");

  const images = [
    { id: 1, src: call1, alt: "Signature 1", value: "signature1" },
    { id: 2, src: call2, alt: "Signature 2", value: "signature2" },
  ];

  const handleSelect = (image) => {
    setSelectedImage(image);
    setIsOpen(false);
  };

  const handleGenerateLetterpad = async () => {
    if (!selectedImage) {
      alert("Please select a signature before generating the letterpad.");
      return;
    }

    if (!letterContent.trim()) {
      alert("Please write some content in the letter before generating.");
      return;
    }

    const letterpadData = {
      signature: selectedImage.value,
      content: letterContent,
    };

    try {
      const response = await axios.post("http://localhost:3001/api/letterpad", letterpadData);

      if (response.status === 201) {
        alert("Letterpad saved successfully!");
        ipcRenderer.send("open-letterpad", letterpadData); // optional - opens letterpad in Electron
      } else {
        alert("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error saving letterpad:", error);
      alert(error.response?.data?.message || "Failed to save letterpad.");
    }
  };



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white border border-gray-300 rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Generate Letterpad</h1>

        <div className="flex flex-col items-center gap-6">
          <div className="relative flex justify-center w-full">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="px-4 py-2 text-sm font-medium bg-gray-200 rounded-lg"
            >
              {selectedImage ? `Selected: ${selectedImage.alt}` : "Select Signature"}
            </button>

            {isOpen && (
              <div className="absolute z-10 w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-md top-full">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="flex items-center justify-start p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSelect(image)}
                  >
                    <img src={image.src} alt={image.alt} className="w-10 h-10 rounded" />
                    <span className="ml-2 text-sm">{image.alt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <textarea
            value={letterContent}
            onChange={(e) => setLetterContent(e.target.value)}
            placeholder="Write your letter content here..."
            className="w-full h-40 p-3 mt-2 text-sm border border-gray-300 rounded-lg resize-none"
          ></textarea>

          {selectedImage && (
            <div className="mt-4">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-24 h-24 border border-gray-300 rounded-lg"
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleGenerateLetterpad}
            className="px-6 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Generate Letterpad
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateLetterpad;
