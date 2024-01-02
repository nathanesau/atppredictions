import { useAuth0 } from "@auth0/auth0-react";
import { getConfig } from "../config";
import React, { useState, useEffect } from "react";
import { Button, Alert } from "reactstrap";
import { handleConsent, handleLoginAgain, callApiWithAuth, postApiWithAuth } from "../utils/authUtils";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import Loading from "../components/Loading";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { Link } from "react-router-dom";
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

const options = [
  'None',
  'Atria',
  'Callisto',
  'Dione',
  'Ganymede',
  'Hangouts Call',
  'Luna',
  'Oberon',
  'Phobos',
  'Pyxis',
  'Sedna',
  'Titania',
  'Triton',
  'Umbriel',
];

function ConfirmationDialogRaw(props) {
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const radioGroupRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>Phone Ringtone</DialogTitle>
      <DialogContent dividers>
        <RadioGroup
          ref={radioGroupRef}
          aria-label="ringtone"
          name="ringtone"
          value={value}
          onChange={handleChange}
        >
          {options.map((option) => (
            <FormControlLabel
              value={option}
              key={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
};

export const PredictionComponent = () => {
   
    const { apiOrigin, audience } = getConfig();

    const [state, setState] = useState({
        showResult: false,
        entrants: [],
        prediction: null,
        error: null,
    });

    const columns = [
      /*{
        field: 'id',
        headerName: 'ID',
        width: 90,
        sortable: true
      },*/
      {
        field: 'order',
        headerName: 'Order',
        type: 'number',
        width: 150,
        editable: false,
        sortable: true
      },
      {
        field: 'player_name',
        headerName: 'Name',
        width: 150,
        editable: false,
        sortable: true
      },
      {
        field: 'quarter',
        headerName: 'Quarter',
        type: 'number',
        width: 110,
        editable: false,
        sortable: false
      },
      {
        field: 'last_updated',
        headerName: 'Last Updated',
        width: 250,
        editable: false,
      }
    ];

    useEffect(() => {
        if (!state.showResult && state.error == null) {
          callApi();
        }
      });

    const { tournamentId, tournamentName, tournamentStartDate, tournamentEndDate } = useParams();

    console.log(tournamentId);
    console.log(tournamentName);
    console.log(tournamentStartDate);
    console.log(tournamentEndDate);

    // TODO: useEffect to load entrants

    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('Dione');  

    const handleClickListItem = () => {
      setOpen(true);
    };
  
    const handleClose = (newValue) => {
      setOpen(false);
  
      if (newValue) {
        setValue(newValue);
      }
    };

    const {
        isAuthenticated,
        user,
        getAccessTokenSilently,
        loginWithPopup,
        getAccessTokenWithPopup,
    } = useAuth0();

    const mapEntrants = function(entrants) {
      const res = [];
      const drawSize = Math.pow(2, Math.ceil(Math.log2(entrants.length)));
      for (const entrant of entrants) {
        res.push({
          id: entrant.player_id,
          quarter: Math.ceil(entrant.order/drawSize * 4),
          order: entrant.order,
          player_name: entrant.player_name,
          last_updated: entrant.last_updated,
        })
      }
      return res;
    }

    const callApi = async (body) => {
        try {
            // technically, this API call doesn't require auth
            const responseData = await callApiWithAuth(
                getAccessTokenSilently,
                `${apiOrigin}/get_entrants?tournament_id=${tournamentId}`
            );

            setState({
                ...state,
                showResult: true,
                entrants: mapEntrants(responseData.entrants)
            });
        } catch (error) {
            setState({
                ...state,
                error: "external_api_failed"
            });
        }
    }

    // called when button is clicked
    const postApi = async (body) => {
        try {
            const responseData = await postApiWithAuth(
                getAccessTokenSilently,
                `${apiOrigin}/save_prediction`,
                body
            );

            setState({
                ...state,
                prediction: responseData.prediction
            });
        } catch (error) {
            setState({
                ...state,
                error: "save_prediction_failed"
            });
        }
    };

    const handle = (e, fn) => {
        e.preventDefault();
        fn();
    }

    return (
        <>
          <div className="mb-5">
            {state.error === "consent_required" && (
              <Alert color="warning">
                You need to{" "}
                <a
                  href="#/"
                  class="alert-link"
                  onClick={(e) => handle(e, handleConsent(getAccessTokenWithPopup, callApi, state, setState))}
                >
                  consent to get access to users api
                </a>
              </Alert>
            )}
    
            {state.error === "login_required" && (
              <Alert color="warning">
                You need to{" "}
                <a
                  href="#/"
                  class="alert-link"
                  onClick={(e) => handle(e, handleLoginAgain(loginWithPopup, callApi, state, setState))}
                >
                  log in again
                </a>
              </Alert>
            )}
    
            {state.error === "external_api_failed" && (
              <Alert color="warning">
                Failed to fetch entrant information
              </Alert>
            )}
    
            <h3>Prediction for {tournamentName} ({tournamentStartDate} to {tournamentEndDate})</h3>
            {isAuthenticated && (
            <p className="lead">
                Make a prediction!
            </p>
            )}
          </div>

          {!state.showResult && (
            <Loading />
            )}
    
          {/* https://mui.com/material-ui/react-table/ */}
          <div>
            {state.showResult && (
              <div data-testid="api-result">
                <h6 className="muted">Entrants</h6>
    
                <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={state.entrants}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
              />
            </Box>

            <br />
          <div>
            <h6 className="muted">Prediction</h6>
                
            <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <List component="div" role="group">
        <ListItemButton divider disabled>
          <ListItemText primary="Predictions" />
        </ListItemButton>
        <ListItemButton
          divider
          aria-haspopup="true"
          aria-controls="ringtone-menu"
          aria-label="phone ringtone"
          onClick={handleClickListItem}
        >
          <ListItemText primary="Champion" secondary={value} />
        </ListItemButton>
        <ListItemButton divider disabled>
          <ListItemText primary="Runner-Up" secondary="None" />
        </ListItemButton>
        <ConfirmationDialogRaw
          id="ringtone-menu"
          keepMounted
          open={open}
          onClose={handleClose}
          value={value}
        />
      </List>

      <Button
                    id="savePreditionButton"
                    color="primary"
                    disabled="true"
                    block
                    onClick={() => { console.log("clicked"); }}
                  >
                    Make Prediction
                  </Button>
    </Box>
            </div>

              </div>


            )}

          </div>
        </>
      );

};

export default PredictionComponent;