/**
 * The config to setup an eAdapter client
 */
export interface Config {
  /**
   * The url to your eAdapter wsdl
   */
  wsdlUrl: string;

  /**
   * When provided, the soap client will use this xml string instead of fetching the wsdlUrl contents.
   */
  wsdlXml?: string;

  /**
   * The default sending system ID recorded as the EDI sender.
   *
   * Typically this is a 9 character code found on the about page in CW1.
   */
  clientId: string;

  /**
   * eAdapter username/password is setup in CW1 registry settings.
   */
  username: string;
  password: string;
}
