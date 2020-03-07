import React, { useState } from 'react';
import LineGraph from './LineGraph';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  tableContainer: {
    display: 'flex'
  },
  tableStyle: {
    flex: 2,
  },

}));

export default function Temperature(props) {
  const classes = useStyles();

  return(
    <React.Fragment>
      <h3>Temperature Graph</h3>
      <Container>
        <Grid container md spacing={1}>
          <Grid item md={7}>
            <LineGraph className={classes.tableStyle}/>
          </Grid>
          <Grid item md={5}>
            weewoo
          </Grid>
        </Grid>
      </Container>
      {/* <div className={classes.tableContainer}>
        <LineGraph className={classes.tableStyle}/>
        <div className={classes.tableStyle}>
          insert description
        </div>
      </div> */}
      
    </React.Fragment>
    
  )
}