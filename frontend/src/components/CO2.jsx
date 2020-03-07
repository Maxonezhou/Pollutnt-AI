import React, { useState } from 'react';
import LineGraph from './LineGraph';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Container,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
 } from '@material-ui/core';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Label, ResponsiveContainer, Tooltip } from 'recharts';

const useStyles = makeStyles(theme => ({
  tableContainer: {
    maxHeight: 450,
    overflowY: 'auto'
  },
  tableStyle: {
    flex: 2,
  },
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

export default function CO2(props) {

  const { data } = props;

  const classes = useStyles();

  return(
    <React.Fragment>
      <h3>CO2 Graph</h3>
      <Container>
        <Grid container spacing={1}>
          <Grid item md={7}>
            <div className={classes.graphContainer}>
              {/* <h3 className={classes.tableTitle}>Chart Title</h3> */}
              <LineChart width={600} height={300} data={data}>
                <Line type="monotone" dataKey="CO2" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="time" />
                <YAxis/>
                <Tooltip />
              </LineChart>
            </div>
          </Grid>
          <Grid item md={5}>
            <TableContainer className={classes.tableContainer}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Time
                    </TableCell>
                    <TableCell>
                      CO2 (Parts per million)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map(data => (
                    <TableRow>
                      <TableCell>
                        {data.time}
                      </TableCell>
                      <TableCell>
                        {data.CO2}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

            </TableContainer>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
    
  )
}