import React, { useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Label, ResponsiveContainer, Tooltip } from 'recharts';
import { Paper, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
  graphContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: 20
  },
  graphTitle: {
    marginLeft: 'auto',
    marginRight: 'auto',
  }
}));

export default function LineGraph(props) {

  const { data, dataKey } = props;

  const classes = useStyles();


  return (
    <React.Fragment>
      <div className={classes.tableContainer}>
        {/* <h3 className={classes.tableTitle}>Chart Title</h3> */}
        <LineChart width={600} height={300} data={data}>
          <Line type="monotone" dataKey={dataKey} stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </div>
    </React.Fragment>
  )
}
