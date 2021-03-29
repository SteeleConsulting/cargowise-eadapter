/**
 * The message type you can send through the eAdapter
 */
export interface EHubGatewayMessage {
  attributes: {
    /**
     * The sending system ID recorded as sender on the EDI Interchange
     */
    ClientID: string;

    /**
     * This is a GUID you provide.
     *
     * With this id you can look into CW1 EDI Interchange for the status of the message.
     */
    TrackingID: string;

    ApplicationCode:
      | "NDM" // for Native XML
      | "UDM"; // for Universal XML

    SchemaName:
      | "http://www.cargowise.com/Schemas/Native#UniversalInterchange" // for Native XML
      | "http://www.cargowise.com/Schemas/Universal/2011/11#UniversalInterchange"; // for Universal XML

    SchemaType: "Xml";
  };

  /**
   * The compressed message
   */
  $value: string;
}
