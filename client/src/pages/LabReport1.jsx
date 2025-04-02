import React from 'react';

const App = () => {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  const boxStyle = {
    height: '500px', // Same height for all boxes
    margin: '0 2px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: '18px',
    border: '2px solid black', // Added border
    flexDirection: 'column',
  };

  const box1Style = {
    ...boxStyle,
    width: '30px',
    background: 'linear-gradient(to right, #991b1b, #7f1d1d, #450a0a)', // Gradient background
    borderRadius: '7px', // Round the corners
    boxSizing: 'border-box',
  };

  const box2Style = {
    ...boxStyle,
    width: '800px',
    padding: '0', // Remove default padding
    display: 'flex', // Flex container for vertical alignment
    flexDirection: 'row', // Align text and box side by side
    alignItems: 'flex-start',
  };

  const box3Style = {
    ...boxStyle,
    width: '60px',
    background: 'linear-gradient(to right, #991b1b, #7f1d1d, #450a0a)', // Gradient background
    borderRadius: '7px', // Round the corners
    boxSizing: 'border-box',
  };

  const topGradientStyle = {
    height: '90px',
    width: 'calc(100% - 180px)', // Adjust width to account for the side box
    background: 'linear-gradient(to right, #991b1b, #7f1d1d, #450a0a)', // Gradient background
    padding: '10px', // Add padding from all four sides
    margin: '2px', // Add margin from all four sides
    borderRadius: '7px', // Round the corners
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row', // Align text and box side by side
    alignItems: 'center',
    justifyContent: 'space-between', // Space out text and the side box
    color: 'white',
    textAlign: 'center', // Center text alignment
  };

  const contentStyle = {
    flex: 1, // Take remaining height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4682b4', // Background color for the remaining section of Box 2
  };

  const sideBoxStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '150px',
    border: '2px solid white', // White border
    borderRadius: '7px', // Round the corners
    padding: '10px',
    boxSizing: 'border-box',
    backgroundColor: '#333', // Dark background for contrast
  };

  const sideBoxColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '50px', // Height for each column item
    borderBottom: '2px solid white', // White border for columns
    justifyContent: 'center',
    color: 'white',
    fontSize: '16px',
    textAlign: 'center',
    boxSizing: 'border-box',
  };

  return (
    <div style={containerStyle}>
      <div style={box1Style}>Box 1</div>
      <div style={box2Style}>
        <div style={topGradientStyle}>
          <div style={{ flex: 1 }}>
            <div>Haryana Laboratory</div>
            <div>Suvidha Marg, Corner Gali no.3, Aggarsain Colony, Sirsa-125055</div>
          </div>
          <div style={sideBoxStyle}>
            <div style={sideBoxColumnStyle}>1</div>
            <div style={sideBoxColumnStyle}>2</div>
            <div style={sideBoxColumnStyle}>3</div>
          </div>
        </div>
        <div style={contentStyle}>
          {/* Content goes here */}
        </div>
      </div>
      <div style={box3Style}>Box 3</div>
    </div>
  );
};

export default App;
