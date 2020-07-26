import React, { CSSProperties } from 'react'
import "../css/Home.css"

class App extends React.Component {
  render() {

    const divStyle: CSSProperties = {
      position: 'relative',
    };

    const divStyle2: CSSProperties = {
      position: 'absolute',
      color: '#ffffff',
      fontSize: '45px',
      fontWeight: 'bold',
      top: '30%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };

    const divStyle3: CSSProperties = {
      position: 'absolute',
      fontSize: '45px',
      color: '#ffffff',
      fontWeight: 'bold',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };

    return (
      <div>
        <div style={divStyle}>
          <img className="bg" src="https://ecussleep.com/wp-content/uploads/Ecus_Sleep-Gradient-Background.jpg" alt="banner" />
          <h1 style={divStyle2}>Ugram</h1>
          <h2 style={divStyle3}>The new Instagram</h2>
        </div>
      </div>
    )
  }
}export default App