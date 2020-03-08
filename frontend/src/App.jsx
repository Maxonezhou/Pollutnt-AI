import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import Beacon from './components/Beacon';
import firebase from 'firebase';
import { 
  Modal,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box, 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const firebaseConfig = {
  apiKey: "AIzaSyCxkOPS5DqnXak4ecDbuPrNKJ-fK4Xc868",
  authDomain: "hacktech2020-88888.firebaseapp.com",
  databaseURL: "https://hacktech2020-88888.firebaseio.com",
  projectId: "hacktech2020-88888",
  storageBucket: "hacktech2020-88888.appspot.com",
  messagingSenderId: "562008011322",
  appId: "1:562008011322:web:ff933e53757c12fd84fb03"
};

firebase.initializeApp(firebaseConfig);
export var database = firebase.database();

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

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

const heatMapData0 = {    
  positions: [
    {lat: 60.05, lng: 30.45, weight: 2},
    {lat: 60, lng: 30.5, weight: 1},
    {lat: 60.078, lng: 30.32, weight: 0.7},
    {lat: 59.94, lng: 30.45, weight: 0.2},
    {lat: 59.94, lng: 30.59, weight: 2},
    {lat: 60.1, lng: 30.70, weight: 2.3},
  ],
  options: {   
    radius: 300,   
    opacity: 0.6,
  }
}

const heatMapData1 = {    
  positions: [
    {lat: 60.05, lng: 30.45, weight: 2},
    {lat: 60, lng: 30.5, weight: 2},
    {lat: 60.078, lng: 30.32, weight: 0.7},
    {lat: 59.94, lng: 30.45, weight: 0.8},
    {lat: 59.94, lng: 30.59, weight: 2},
    {lat: 60.1, lng: 30.70, weight: 1.4},
  ],
  options: {   
    radius: 300,   
    opacity: 0.8,
  }
}

const heatMapData2 = {    
  positions: [
    {lat: 60.05, lng: 30.45, weight: 2},
    {lat: 60, lng: 30.5, weight: 1},
    {lat: 60.078, lng: 30.32, weight: 0.7},
    {lat: 59.94, lng: 30.45, weight: 2},
    {lat: 59.94, lng: 30.59, weight: 1.2},
    {lat: 60.1, lng: 30.70, weight: 1.2},
  ],
  options: {   
    radius: 200,   
    opacity: 0.4,
  }
}

const heatMapData3 = {    
  positions: [
    {lat: 60.05, lng: 30.45, weight: 1},
    {lat: 60, lng: 30.5, weight: 0.4},
    {lat: 60.078, lng: 30.32, weight: 1.2},
    {lat: 59.94, lng: 30.45, weight: 2},
    {lat: 59.94, lng: 30.59, weight: 0.5},
    {lat: 60.1, lng: 30.70, weight: 1.4},
  ],
  options: {   
    radius: 300,   
    opacity: 0.6,
  }
}

const heatMapData4 = {    
  positions: [
    {lat: 60.05, lng: 30.45, weight: 1.5},
    {lat: 60, lng: 30.5, weight: 2},
    {lat: 60.078, lng: 30.32, weight: 0.3},
    {lat: 59.94, lng: 30.45, weight: 1.2},
    {lat: 59.94, lng: 30.59, weight: 2},
    {lat: 60.1, lng: 30.70, weight: 2.3},
  ],
  options: {   
    radius: 300,   
    opacity: 0.6,
  }
}

const heatMapData5 = {    
  positions: [
    {lat: 60.05, lng: 30.45, weight: 2},
    {lat: 60, lng: 30.5, weight: 1},
    {lat: 60.078, lng: 30.32, weight: 1.7},
    {lat: 59.94, lng: 30.45, weight: 2.2},
    {lat: 59.94, lng: 30.59, weight: 2},
    {lat: 60.1, lng: 30.70, weight: 1.2},
  ],
  options: {   
    radius: 300,   
    opacity: 0.6,
  }
}

export default function App() {
  const [prediction, setPrediction] = useState(0);
  const [data, setData] = useState(0);
  const [fakeData, setFakeData] = useState(0);
  const [value, setValue] = useState(0);
  const [heatMapData, setHeatMapData] = useState(heatMapData0);

  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch(newValue){
      case 0:
        setHeatMapData(heatMapData0);
        break;
      case 1:
        setHeatMapData(heatMapData1);
        break;
      case 2:
        setHeatMapData(heatMapData2);
        break; 
      case 3:
        setHeatMapData(heatMapData3);
        break;
      case 4:
        setHeatMapData(heatMapData4);
        break;
      case 5:
        setHeatMapData(heatMapData5);
        break;
      default:
    }

  };

  useEffect(() => {
    const dataRef = database.ref('Data');
    dataRef.on('value', (snapshot) => {
      let value = snapshot.val();
      setData(value);
      
    });
    const predictionRef = database.ref('Prediction');
    predictionRef.on('value', (snapshot) => {
      let value = snapshot.val();
      setPrediction(value);
    })
    const fakeDataRef = database.ref('Data2');
    fakeDataRef.on('value', (snapshot) => {
      let value = snapshot.val();
      setFakeData(value);
    })
  }, [heatMapData]);

  return (
    <div>
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
        </TabPanel>
        <TabPanel value={value} index={1}>
        </TabPanel>
        <TabPanel value={value} index={2}>
        </TabPanel>
        <TabPanel value={value} index={3}>
        </TabPanel>
        <TabPanel value={value} index={4}>
        </TabPanel>
        <TabPanel value={value} index={5}>
        </TabPanel>
      </div>
      <div style={{ position: 'absolute', top: '10%', left: '5%', height: '80%', width: '90%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyBWSzeSPr_5zD53xEs0CU0UTOVYsOb6FvA'}}
          defaultCenter={{
            lat: 60,
            lng: 30.5,
          }}
          options={{ scrollwheel: false }}
          heatmapLibrary={true}          
          heatmap={heatMapData}   
          zoom={11}
        >
          {/* {lat: 60.05, lng: 30.45, weight: 2},
    {lat: 60, lng: 30.5, weight: 1},
    {lat: 60.078, lng: 30.32, weight: 1.7},
    {lat: 59.94, lng: 30.45, weight: 2.2},
    {lat: 59.94, lng: 30.59, weight: 2},
    {lat: 60.1, lng: 30.70, weight: 1.2}, */}
          <Beacon 
            lat={60}
            lng={30.5}
            data={Object.values(data)}
            prediction={Object.values(prediction)}
          />
          <Beacon
            lat={60.05}
            lng={30.45}
            data={Object.values(fakeData)}
          />
          <Beacon
            lat={60.078}
            lng={30.32}
            data={Object.values(fakeData)}
          />
          <Beacon
            lat={59.94}
            lng={30.45}
            data={Object.values(fakeData)}
          />
          <Beacon
            lat={59.94}
            lng={30.59}
            data={Object.values(fakeData)}
          />
          <Beacon
            lat={60.01}
            lng={30.70}
            data={Object.values(fakeData)}
          />

        </GoogleMapReact>
      </div>
    </div>
    
  );
}
