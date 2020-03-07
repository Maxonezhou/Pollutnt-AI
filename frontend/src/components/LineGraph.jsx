import React, { useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Label, ResponsiveContainer, Tooltip } from 'recharts';
import { Paper, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

function createData(time, amount) {
  return { time: time, amount: amount , amount2: 300};
}
  
const testData = [
  createData(0, 0),
  createData(1, 300),
  createData(2, 600),
  createData(3, 800),
  createData(4, 1500),
  createData(5, 2000),
  createData(6, 2400),
  createData(7, 2400),
];

const useStyles = makeStyles(theme => ({
  tableContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: 20
  },
  tableTitle: {
    marginLeft: 'auto',
    marginRight: 'auto',
  }
}));

export default function LineGraph() {

  const classes = useStyles();

  const [data, setData] = useState(testData);

  const addData = () => {
    setData([...data, {time: data[data.length - 1].time + 1, amount:  (data[data.length - 1].amount * 7) % 1300 , amount2: 500 }])
  }

  return (
    <React.Fragment>
      <div className={classes.tableContainer}>
        {/* <h3 className={classes.tableTitle}>Chart Title</h3> */}
        <LineChart width={600} height={300} data={data}>
          <Label position="insideTop" offset={0} value="Graph Title" />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          <Line type="monotone" dataKey="amount2" stroke="#4dbd6b" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </div>
    </React.Fragment>
  )
}
