import React from "react";
import lablogo from "../images/lablogo.png";
import "./LabReport.css";
function LabReport() {
  // const [pdfurl, setpdfurl] = useState(null);
  const moisture = 111;
  const oil = 188;
  const ffa = 339;
  const digits = `${moisture}${oil}${ffa}`.split("");

  // Function to count the occurrences of each digit
  const countOccurrences = (digit) =>
    digits.filter((d) => d === String(digit)).length;

  // const digitArray = Array.from({ length: 10 }, (_, i) => i);
  const digitArray = Array.from({ length: 9 }, (_, i) => i + 1).concat([0]);

  return (
    <>
      <div className="body">
        <div className="rep">Analysis Report</div>

        <div>
          <div className="sidebar">
            Regd. No. 05/11/03956/P .M.T/SSI/Dt. 11-04-86
          </div>

          <div className="bodysec">
            <div className="head">
              <div className="head2">
                <div className="logo">
                  <img src={lablogo} alt="Lab Logo" className="img" />
                </div>
                <div className="name">
                  <h1 className="head3">Haryana Laboratory</h1>
                  <p className="adder">
                    Suvidha Marg, Corner Gali no.3, Aggarsain Colony,
                    Sirsa-125055
                  </p>
                </div>
              </div>

              <div className="num">
                <div className="icons">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    alt="WhatsApp"
                    className="imagee"
                  />
                  <p className="numtext">86076-23157</p>
                </div>
                <div className="icons">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/597/597177.png"
                    alt="Mobile"
                    className="imagee"
                  />
                  <p className="numtext">91833-23157</p>
                </div>
                <div className="icons">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/597/597177.png"
                    alt="Mobile"
                    className="imagee"
                  />
                  <p className="numtext">94655-37157</p>
                </div>
                <div className="icons">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/597/597177.png"
                    alt="Mobile"
                    className="imagee"
                  />
                  <p className="numtext">81685-26828</p>
                </div>
              </div>

              {/* info  no dt  */}
              <div className="infodt">
                <div className="infodtpart2">
                  <span className="NOO">No.</span>
                  <input type="text" className="inputfield" />
                </div>
                <div className="infodtpart2">
                  <span className="spandt">Dt.</span>
                  <input type="text" className="extra" />
                </div>
              </div>
            </div>

            <div className="IDK">
              <span className="spanblockExtra">
                We hereby certify that the sample described
                as...........................................................................................
                received by us
              </span>
              <span className="spanblock">
                on dt. .............................................. From
                Sh.M/s..........................................................................................................................
              </span>
              <span className="spanblock">
                ..............................................................................being
                particular and result as under.
                <span className="HARYANA">Sample Not Drawn by Haryana Lab</span>
              </span>
              <span className="spanblock">
                Remarks...........................................................................................................................................................................................
              </span>
            </div>

            <div className="flexing">
              <div className="imptext">
                <div>
                  <span className="spantext">Moisture</span>

                  <span className="leftmar">NA</span>
                </div>
              </div>
              <div className="imptext">
                <div>
                  <span className="spantext">Oil</span>
                  <span className="leftmar">NA</span>
                </div>
              </div>
              <div className="imptext">
                <div>
                  <span className="spantext">FFA</span>
                  <span className="leftmar">NA</span>
                </div>
              </div>
            </div>

            {/* Signature and other section */}
            <div className="grid grid-cols-6 mt-3">
              {/* Existing Columns */}
              <div className="bottomText">
                <p className="para">Code/Sample No.</p>
                <p className="marg">13A</p>
              </div>

              <div className="bottombox">
                <p className="para">Date</p>
                <p className="marg">12/12/24</p>
              </div>

              <div className="bottombox">
                <p className="para">Vehicle No.</p>
                <p className="marg">2346</p>
              </div>

              <div className="bottombox">
                <p className="para">Bags</p>
                <p className="marg">234</p>
              </div>

              <div className="bottombox">
                <p className="para">Weight (Ql.)</p>
                <p className="marg">123.46</p>
              </div>

              <div className="remark">
                <p className="sign">Signature</p>
                <p className="description">
                  All disputes are subject to SRSA jurisdiction
                </p>
                <p className="imageofsign">[Signature Image]</p>
                <p className="distributionText">
                  Samples will be destroyed after function.
                </p>
              </div>
            </div>

            <div className="whatisthat">
              {/* Seal Engraved */}
              <div className="namelast ">
                <p className="testseal">Seal Engraved</p>
                <p className="sealimg">[Seal Image]</p>
              </div>
            </div>

            <div className="base">
              A House For Analysis of Rice Bran, Oil Seeds, Oil Cakes, Atta,
              Maida, Suzi, Besan, Spices, Condiments, Acids & Fertilizers.
            </div>
            <div className="rightbar1">
              <div className="top">Since</div>
              {/*Something working on stars   ^-^ */}

              {digitArray.map((digit) => {
                // Get the count of occurrences for the current digit
                const count = countOccurrences(digit);

                // Create an array of stars with length equal to count
                const starsArray = Array(count).fill("★");

                return (
                  <div key={digit} className="rightbar">
                    {/* Top stars */}
                    <div className="star1">
                      {starsArray.slice(0, 5).map((star, index) => (
                        <span key={`top-${index}`}>{star}</span>
                      ))}
                    </div>

                    {/* Number with stars on the sides */}
                    <div className="star2">
                      {/* Left stars */}
                      <div className="star22">
                        {starsArray.slice(5, 7).map((star, index) => (
                          <div key={`left-${index}`}>{star}</div>
                        ))}
                      </div>

                      {/* Right stars */}
                      <div className="star3">
                        {starsArray.slice(7, 9).map((star, index) => (
                          <div key={`right-${index}`}>{star}</div>
                        ))}
                      </div>

                      {/* Number in the center */}
                      <div className="text-base">{digit}</div>
                    </div>
                  </div>
                );
              })}

              <div className="final">1985</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LabReport;
