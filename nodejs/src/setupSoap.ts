import fetch from "node-fetch";
import * as soap from "soap";
import * as urllib from "url";
import { Config } from "./config";

/**
 * Setup a soap client that is compatible with CW1 eAdapter service.
 *
 * @param config eAdapter config
 * @returns soap client and WSDL object
 */
export async function setupSoap(
  config: Config
): Promise<{
  wsdl: soap.WSDL;
  client: soap.Client;
}> {
  const url = new urllib.URL(config.wsdlUrl);

  if (typeof config.wsdlXml !== "string") {
    const res = await fetch(config.wsdlUrl);
    config.wsdlXml = await res.text();
  }

  const wsdlXml = config.wsdlXml.replace(
    /Server:SOAPWebServicePort/gi,
    url.hostname
  );

  const wsdl = new soap.WSDL(wsdlXml, config.wsdlUrl, {});

  await new Promise((resolve, reject) =>
    wsdl.onReady((err) => (err ? reject(err) : resolve(undefined)))
  );

  const client = new soap.Client(wsdl);
  client.setSecurity(new soap.WSSecurity(config.username, config.password));

  return {
    wsdl,
    client,
  };
}
