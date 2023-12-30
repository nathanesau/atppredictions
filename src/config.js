export function getConfig() {
  const audience = "atppredictions";

  const domain = process.env.DOMAIN;

  const clientId = process.env.CLIENT_ID;

  return {
    domain: domain,
    clientId: clientId,
    ...(audience ? { audience } : null),
  };
}
