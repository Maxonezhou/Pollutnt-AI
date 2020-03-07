import React, { useState } from 'react';
import LineGraph from './LineGraph';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  tableContainer: {
    display: 'flex'
  },
  tableStyle: {
    flex: 2,
  },

}));

export default function Humidity(props) {

  const { data } = props;

  const classes = useStyles();

  return(
    <React.Fragment>
      <h3>Humidity Graph</h3>
      <Container>
        <Grid container spacing={1}>
          <Grid item md={7}>
            <LineGraph className={classes.tableStyle} data={data} dataKey="humidity"/>
          </Grid>
          <Grid item md={5}>
            weewoo
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
    
  )
}