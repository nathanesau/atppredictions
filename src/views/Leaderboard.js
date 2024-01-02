import React, { useState, useEffect } from "react";
import { Button, Alert } from "reactstrap";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Highlight from "../components/Highlight";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import { handleConsent, handleLoginAgain, callApiWithAuth } from "../utils/authUtils";
import Loading from "../components/Loading";
import { useParams } from 'react-router-dom';

export const LeaderboardComponent = () => {
  // apigateway, see https://github.com/nathanesau/atppredictionsapi
  //const { apiOrigin = "https://tnglzfths0.execute-api.us-east-1.amazonaws.com/prod", audience } = getConfig();
  const { apiOrigin, audience } = getConfig();

  const [state, setState] = useState({
    showResult: false,
    tournaments: [],
    error: null,
  });

  const { id } = useParams();

  console.log(id);

  useEffect(() => {
    //console.log(leaderboardId);
    
    if (!state.showResult && state.error == null) {
      callApi();
    }
  });

  const {
    getAccessTokenSilently,
    loginWithPopup,
    getAccessTokenWithPopup,
  } = useAuth0();

  const callApi = async () => {
    try {
      // TODO: call get
      const responseData = await callApiWithAuth(
        getAccessTokenSilently,
        `${apiOrigin}/get_customized_tournaments`
      );

      setState({
        ...state,
        showResult: true,
        tournaments: responseData.tournaments,
      });
    } catch (error) {
      setState({
        ...state,
        error: "external_api_failed",
      });
    }
  };

  const handle = (e, fn) => {
    e.preventDefault();
    fn();
  };

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
            Failed to fetch leaderboard information
          </Alert>
        )}

        <h1>Leaderboard</h1>
        <p className="lead">
          View the predictions leaderboard.
        </p>
      </div>

      {!state.showResult && (
        <Loading />
      )}

      {/* https://mui.com/material-ui/react-table/ */}
      <div className="result-block-container">
        {state.showResult && (
          <div className="result-block" data-testid="api-result">
            <h6 className="muted">Result</h6>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Tournament Name</TableCell>
                    <TableCell align="right">Start Date</TableCell>
                    <TableCell align="right">End Date</TableCell>
                    <TableCell align="right">Location</TableCell>
                    <TableCell align="right">Category</TableCell>
                    <TableCell align="right">Last Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.tournaments.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.start_date}</TableCell>
                      <TableCell align="right">{row.end_date}</TableCell>
                      <TableCell align="right">{row.location}</TableCell>
                      <TableCell align="right">{row.category}</TableCell>
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

export default LeaderboardComponent;