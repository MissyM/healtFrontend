import React, { Component } from 'react';
import './App.css';
import { Bar } from 'react-chartjs-2'
import { DropSheet } from './sheets/dropsheet'

class App extends Component {

  state = {
    data: {}
  }

  constructor(props) {
    super(props);
    this.file = React.createRef();
    this.drop = React.createRef();
  }

  componentDidMount() {
    DropSheet({
      file: this.file.current,
      drop: this.drop.current,
      on: {
        workstart: () => {},
        workend: () => {},
        sheet: data => {
          console.log(data)

        },
      },
      errors: {
        badfile: () => {},
        pending: () => {},
        failed: () => {},
        large: () => {},
      }
    })
  }
  
  render() {
    return (
      <div>
        <div ref={this.drop}>Drop a file here</div>
        <input type="file" ref={this.file} value=""/>
        <label htmlFor="file">... or click here to select a file</label>
        {/* <Bar
          data={this.state.data}
        /> */}
      </div>
    );
  }
}

export default App;
