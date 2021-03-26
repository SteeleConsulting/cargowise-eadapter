import { v4 as uuid4 } from "uuid";
import { compressMessage } from "./compressMessage";

/**
 * The full message type you can send through the eAdapter
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

/**
 * An easier way of describing an eHubGatewayMessage
 */
export interface EHubMsg {
  /**
   * The sending system ID recorded as sender on the EDI Interchange
   */
  clientId: string;

  /**
   * The uncompressed message
   */
  message: string;

  /**
   * The message type. Defaults to "universal-xml"
   */
  type?: "universal-xml" | "native-xml";

  /**
   * If not provided, a trackingId will be generated for you.
   */
  trackingId?: string;
}

/**
 * A convenient way of constructing eHubGatewayMessages ready to send via soap.
 *
 * @param msg an EHubMsg
 * @returns a promise resolving a compressed EHubGatewayMessage
 */
export async function eHubGatewayMessage(
  msg: EHubMsg
): Promise<EHubGatewayMessage> {
  const compressedXml = await compressMessage(msg.message);
  return {
    attributes: {
      ClientID: msg.clientId,
      TrackingID: msg.trackingId || uuid4(),
      ApplicationCode: msg.type === "native-xml" ? "NDM" : "UDM",
      SchemaName:
        msg.type === "native-xml"
          ? "http://www.cargowise.com/Schemas/Native#UniversalInterchange"
          : "http://www.cargowise.com/Schemas/Universal/2011/11#UniversalInterchange",
      SchemaType: "Xml",
    },
    $value: compressedXml,
  };
}
