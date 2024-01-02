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

export const PredictionComponent = () => {
   
    const { apiOrigin, audience } = getConfig();

    const [state, setState] = useState({
        showResult: false,
        entrants: [],
        prediction: null,
        error: null,
    });

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

    const {
        isAuthenticated,
        user,
        getAccessTokenSilently,
        loginWithPopup,
        getAccessTokenWithPopup,
    } = useAuth0();

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
                entrants: responseData.entrants
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
          <div className="result-block-container">
            {state.showResult && (
              <div className="result-block" data-testid="api-result">
                <h6 className="muted">Entrants</h6>
    
                <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Player Id</TableCell>
                    <TableCell align="right">Order</TableCell>
                    <TableCell align="right">Player Name</TableCell>
                    {/*<TableCell align="right">Actual</TableCell>
                    <TableCell align="right">Accuracy</TableCell>*/}
                    <TableCell align="right">Last Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.entrants.map((row) => (
                    <TableRow
                      key={row.player_id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.player_id}
                      </TableCell>
                      <TableCell align="right">{row.order}</TableCell>
                      <TableCell align="right">{row.player_name}</TableCell>
                      <TableCell align="right">{row.last_updated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>


              </div>
            )}
          </div>
        </>
      );

};

export default PredictionComponent;