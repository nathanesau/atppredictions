export function getConfig() {
  // TODO: manage this via secrets
  const audience = "atppredictions";

  // TODO: manage this via secrets
  const domain = "dev-e7x276delr7bwmo8.us.auth0.com";

  // TODO: manage this via secrets
  const clientId = "IQ2txbSiLA50jhKgS42iNAgz4wTL0Sq7";

  // TODO: manage this via secrets
  const apiOrigin = "https://tnglzfths0.execute-api.us-east-1.amazonaws.com/prod";
  //const apiOrigin = "http://localhost:3001";

  return {
    domain: domain,
    clientId: clientId,
    apiOrigin: apiOrigin,
    ...(audience ? { audience } : null),
  };
}
