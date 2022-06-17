/** Get https server options */
const getHttpsOptions = (useHttps = false) => {
  if (!useHttps) {
    return {};
  }

  // Self-signed certs require "--unsafely-ignore-certificate-errors=localhost"
  const certFile = Deno.env.get("OAK_SECURE_CERT_PATH") ?? "./tls/example.crt";
  const keyFile = Deno.env.get("OAK_SECURE_KEY_PATH") ?? "./tls/example.key";

  return {
    secure: true,
    certFile,
    keyFile,
  };
};

export { getHttpsOptions };
