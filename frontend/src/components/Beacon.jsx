import React, { useState } from 'react';
import PlaceIcon from '@material-ui/icons/Place';
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


export default function Beacon() {

  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }

  return(
    <div>
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
                <Tab label="Temperature" {...a11yProps(0)} />
                <Tab label="Humidity" {...a11yProps(1)} />
                <Tab label="Air Quality" {...a11yProps(2)} />
                <Tab label="Data 4" {...a11yProps(3)} />
                <Tab label="Data 5" {...a11yProps(4)} />
                <Tab label="Data 6" {...a11yProps(5)} />
                <Tab label="Data 6" {...a11yProps(6)} />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              <Temperature />
            </TabPanel>
            <TabPanel value={value} index={1}>
              Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
              Item Three
            </TabPanel>
            <TabPanel value={value} index={3}>
              Item Four
            </TabPanel>
            <TabPanel value={value} index={4}>
              Item Five
            </TabPanel>
            <TabPanel value={value} index={5}>
              Item Six
            </TabPanel>
            <TabPanel value={value} index={6}>
              Item Seven
            </TabPanel>
          </div>
        </div>
      </Modal>
    </div>
  )
}
