import React, { useState, useEffect } from "react";
import moment from "moment"
import { Button, Alert } from "reactstrap";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { Link } from "react-router-dom";
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Highlight from "../components/Highlight";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import { ConditionalLink } from "../utils/routerUtils";
import { handleConsent, handleLoginAgain, callApiWithAuth } from "../utils/authUtils";
import Loading from "../components/Loading";

export const TournamentsComponent = () => {
  // apigateway, see https://github.com/nathanesau/atppredictionsapi
  //const { apiOrigin = "https://tnglzfths0.execute-api.us-east-1.amazonaws.com/prod", audience } = getConfig();
  const { apiOrigin, audience } = getConfig();

  const [state, setState] = useState({
    showResult: false,
    currentDate: new Date(),
    tournaments: [],
    error: null,
  });

  useEffect(() => {
    if (!state.showResult && state.error == null) {
      callApi();
    }
  });

  const {
    isAuthenticated,
    user,
    getAccessTokenSilently,
    loginWithPopup,
    getAccessTokenWithPopup,
  } = useAuth0();

  const mapTournaments = function(tournaments) {
    const res = [];
    for (const tournament of tournaments) {
      res.push({
        name: tournament.name,
        start_date: new Date(tournament.start_date),
        end_date: new Date(tournament.end_date),
        location: tournament.location,
        last_updated: tournament.last_updated,
        category: tournament.category,
        id: tournament.id
      })
    }
    return res;
  }

  const callApi = async () => {
    try {
      const responseData = await callApiWithAuth(
        getAccessTokenSilently,
        `${apiOrigin}/get_customized_tournaments`
      );

      setState({
        ...state,
        showResult: true,
        tournaments: mapTournaments(responseData.tournaments)
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

        <h1>Tournaments</h1>
        {isAuthenticated && (
        <p className="lead">
          View past predictions and make new predictions.
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
            <h6 className="muted">Predictions for {user.name}</h6>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Tournament Name</TableCell>
                    <TableCell align="right">Start Date</TableCell>
                    <TableCell align="right">End Date</TableCell>
                    <TableCell align="right">Location</TableCell>
                    <TableCell align="right">Category</TableCell>
                    <TableCell align="right">Prediction</TableCell>
                    {/*<TableCell align="right">Actual</TableCell>
                    <TableCell align="right">Accuracy</TableCell>*/}
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
                      <TableCell align="right">{row.start_date.toLocaleDateString('en-US', { timeZone: 'UTC' })}</TableCell>
                      <TableCell align="right">{row.end_date.toLocaleDateString('en-US', { timeZone: 'UTC' })}</TableCell>
                      <TableCell align="right">{row.location}</TableCell>
                      <TableCell align="right">{row.category}</TableCell>
                      <TableCell align="right">
                        <ConditionalLink to={`/prediction/${row.id}/${row.name}/${moment(row.start_date).utc().format("ll")}/${moment(row.end_date).utc().format("ll")}`} condition={state.currentDate < row.end_date}>
                          Make Prediction
                        </ConditionalLink>
                      </TableCell>
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

export default TournamentsComponent;