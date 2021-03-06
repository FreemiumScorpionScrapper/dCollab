import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles, withStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import IconButton from '@material-ui/core/IconButton'
import SyncIcon from '@material-ui/icons/Sync'
import Kanban from '../../containers/kanban'

const useStyles = makeStyles((theme) => ({
  tabAreaRoot: {
    position: 'relative',
    display: 'flex'
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  padding: {
    padding: theme.spacing(3),
  },
  refreshButton: {
    flex: '0 0 auto',
    borderBottom: '1px solid #e8e8e8',
  }
}));

const AntTabs = withStyles({
  root: {
    flex: '1 1 auto',
    borderBottom: '1px solid #e8e8e8',
    position: 'relative',
  },
  indicator: {
    backgroundColor: '#1890ff',
  },
})(Tabs);

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(1),

    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&$selected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#40a9ff',
    },
  },
  selected: {},
}))((props) => <Tab {...props} />);


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
      className='flexGrow positionRelative'
    >
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};


export default function KanbanPanel() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.tabAreaRoot}>
        <AntTabs value={value} onChange={handleChange}>
          <AntTab label="My Kanban"/>
          <AntTab label="Alice's Kanban"/>
          <AntTab label="Bob's Kanban"/>
        </AntTabs>
        <div className={classes.refreshButton}>
          <IconButton>
            <SyncIcon/>
          </IconButton>
        </div>
      </div>
      <TabPanel value={value} index={0}>
        <Kanban/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </div>
  );
}