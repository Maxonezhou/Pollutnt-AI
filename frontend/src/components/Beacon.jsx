import React, { useState, useEffect } from 'react';
import PlaceIcon from '@material-ui/icons/Place';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { 
  Modal,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box, 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LineGraph from './LineGraph';
import Temperature from './Temperature';
import Altitude from './Altitude';
import CO2 from './CO2';
import Humidity from './Humidity';
import Pressure from './Pressure';
import TVOC from './TVOC';

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: '85%',
    height: '85%',
    top: '5%',
    left: '5%',
    overflowY: 'auto',
  },
  tableContainer: {
    display: 'flex'
  },
  tableStyle: {
    flex: 2,
  },
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}


export default function Beacon(props) {
  const { data } = props;

  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
 
  const [altData, setAltData] = useState([]);
  const [CO2Data, setCO2Data] = useState([]);
  const [humData, setHumData] = useState([]);
  const [presData, setPresData] = useState([]);
  const [TVOCData, setTVOCData] = useState([]);
  const [tempData, setTempData] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }

  useEffect(() => {
    if (data[0]) {
      const timeOffset = data[0].Time;
       // setting new altitude data
      const newAltData = data.map(e => {
        return {altitude: e.Altitude, time: e.Time - timeOffset}
      })
      setAltData(newAltData);
      // setting new CO2 data
      const newCO2Data = data.map(e => {
        return {CO2: e.CO2, time: e.Time - timeOffset}
      })
      setCO2Data(newCO2Data);
      // setting new humidity data
      const newHumData = data.map(e => {
        return {humidity: e.Humidity, time: e.Time - timeOffset}
      })
      setHumData(newHumData);
      // setting new pressure data
      const newPresData = data.map(e => {
        return {pressure: e.Pressure, time: e.Time - timeOffset}
      })
      setPresData(newPresData);
      // setting new TVOC data
      const newTVOCData = data.map(e => {
        return {TVOC: e.TVOC, time: e.Time - timeOffset}
      })
      setTVOCData(newTVOCData);
      // setting new temperature data
      const newTempData = data.map(e => {
        return {temperature: e.Temperature, time: e.Time - timeOffset}
      })
      setTempData(newTempData);
    }
   
  }, [data])


  const [rot, setRot] = useState(0);

  const incRot = () => {
    setRot(rot + 45);
  }


  return(
    <div>
      <ArrowUpwardIcon 
        style={{transform: `rotate(${rot}deg)`}}
      />
      <PlaceIcon 
        style={{fontSize: 50}} 
        color="secondary"
        onClick={handleOpen}
      />
     <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div className={classes.paper}>
          <h2>Beacon 123</h2>
          <div className={classes.root}>
            <AppBar position="static" color="default">
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Altitude" {...a11yProps(0)} />
                <Tab label="CO2" {...a11yProps(1)} />
                <Tab label="Humidity" {...a11yProps(2)} />
                <Tab label="Pressure" {...a11yProps(3)} />
                <Tab label="TVOC" {...a11yProps(4)} />
                <Tab label="Temperature" {...a11yProps(5)} />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              <Altitude data={altData} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <CO2 data={CO2Data} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Humidity data={humData} />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Pressure data={presData} />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <TVOC data={TVOCData} />
            </TabPanel>
            <TabPanel value={value} index={5}>
              <Temperature data={tempData}/>
            </TabPanel>
          </div>
        </div>
      </Modal>
    </div>
  )
}
