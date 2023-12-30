export function getConfig() {
  // TODO: manage this via secrets
  const audience = "atppredictions";

  // TODO: manage this via secrets
  const domain = "dev-e7x276delr7bwmo8.us.auth0.com";

  // TODO: manage this via secrets
  const clientId = "IQ2txbSiLA50jhKgS42iNAgz4wTL0Sq7"

  return {
    domain: domain,
    clientId: clientId,
    ...(audience ? { audience } : null),
  };
}
