import React, { Component } from 'react';
import './App.css';
import { Bar } from 'react-chartjs-2'
import { DropSheet } from './sheets/dropsheet'

const buildReportData = (var1obj, var2obj, semanas) => ({
  labels: semanas,
  datasets: [
    {
      label: var1obj.label,
      data: var1obj.data,
      backgroundColor: 'blue',
    },
    ...var2obj ? [ {
      label: var2obj.label,
      data: var2obj.data,
      backgroundColor: 'pink',
    } ] : [],
  ],
})

class App extends Component {

  state = {
    chartData: {},
    variables: [],
    var1: '',
    var2: '',
    rows: [],
  }

  variableChanged (name, ev) {
    this.setState({ [name]: ev.target.value }, () => {
      this.drawChart()
    })
  }

  drawChart () {
    const variables = this.state.variables
    const rows = this.state.rows
    const var1 = this.state.var1
    const var1Idx = variables.indexOf(var1)
    const var1Dic = {}
    for (let row of rows) {
      var1Dic[row[var1Idx]] = true
    }
    const var1Columns = Object.keys(var1Dic)
    const dataVar1 = var1Columns.map(varCol => rows.filter(row => row[var1Idx] === varCol).length)
    this.setState({
      chartData: buildReportData({
        label: var1,
        data: dataVar1,
      }, null, var1Columns),
    })
  }

  reset () {
    this.setState({
      var1: '',
      var2: '',
      chartData: {},
    })
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
          this.reset()
          const header = data[0]
          const rows = data.slice(1)
          this.setState({
            variables: header,
            rows,
            var1: header[0],
            var2: '',
          }, this.drawChart)
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
        Variable 1:
        <select onChange={this.variableChanged.bind(this, 'var1')} defaultValue={this.state.var1}>
          {this.state.variables.map(
            varName => <option key={varName} value={varName}>{varName}</option>
          )}
        </select>
        Variable 2:
        <select onChange={this.variableChanged.bind(this, 'var2')} defaultValue={this.state.var2}>
          {this.state.variables.map(
            varName => <option key={varName} value={varName}>{varName}</option>
          )}
          <option value="">Ninguna</option>
        </select>
        <div ref={this.drop}>Drop a file here</div>
        <input type="file" ref={this.file} value=""/>
        <label htmlFor="file">... or click here to select a file</label>
        <Bar
          data={this.state.chartData}
          options={{
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
          }}
        />
      </div>
    );
  }
}

export default App;



// const semanaIdx = variables.indexOf('semana')
//     const sexoIdx = variables.indexOf('sexo')
//     const semanasDic = {}
//     for (let row of rows) {
//       semanasDic[row[semanaIdx]] = true
//     }
//     const semanas = Object.keys(semanasDic)
//     const rowsSemanas = semanas.map(semana => rows.filter(row => row[semanaIdx] === semana))
//     const m = rowsSemanas.map(rowsSemana => rowsSemana.reduce((a, row) => a + (row[sexoIdx] === 'M' ? 1 : 0), 0))
//     const f = rowsSemanas.map(rowsSemana => rowsSemana.reduce((a, row) => a + (row[sexoIdx] === 'F' ? 1 : 0), 0))
    