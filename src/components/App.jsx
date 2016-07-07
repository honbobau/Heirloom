import React from 'react';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    }
  };

  handleClick = () => {
    this.setState({ counter: this.state.counter + 1 });
  };

  render() {
    return (
      <div>
        This is my app!!!! { this.state.counter }
        <br />
        <button onClick={this.handleClick}>Click me!!</button>
      </div>
    )
  }
  
}

export default App;