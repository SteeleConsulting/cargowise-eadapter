import * as soap from "soap";
import { v4 as uuid4 } from "uuid";
import { compressMessage } from "./compressMessage";
import { Config } from "./config";
import { EHubGatewayMessage } from "./eHubGatewayMessage";
import { setupSoap } from "./setupSoap";

/**
 * A simple eAdapter client
 */
export class EAdapterClient {
  public soapClient: Promise<soap.Client>;

  constructor(public config: Config) {
    this.soapClient = setupSoap(config).then(({ client }) => client);
  }

  /**
   * Simply ping the CW1 soap server to see if you are connected.
   *
   * @returns true indicating you are connected and authenticated.
   */
  async ping(): Promise<boolean> {
    const client = await this.soapClient;
    const [result] = await client.PingAsync({});
    return result.PingResult;
  }

  /**
   * This is how you send EDI messages into CW1
   * CW1 doesn't respond to this. Instead you can use the tracking ids to look up in CW1 the responses.
   *
   * @param messages messages you wish to send
   * @returns list of tracking ids. The order will be the same as your messages.
   */
  async send(messages: (string | SendMessage)[]): Promise<string[]> {
    const eHubMessages = await Promise.all(
      messages.map(
        async (msg): Promise<EHubGatewayMessage> => {
          const param: SendMessage =
            typeof msg === "string" ? { message: msg } : msg;

          const compressedXml = await compressMessage(param.message);
          return {
            attributes: {
              ClientID: param.clientId || this.config.clientId,
              TrackingID: param.trackingId || uuid4(),
              ApplicationCode: param.type === "native-xml" ? "NDM" : "UDM",
              SchemaName:
                param.type === "native-xml"
                  ? "http://www.cargowise.com/Schemas/Native#UniversalInterchange"
                  : "http://www.cargowise.com/Schemas/Universal/2011/11#UniversalInterchange",
              SchemaType: "Xml",
            },
            $value: compressedXml,
          };
        }
      )
    );

    const trackingIds = eHubMessages.map((m) => m.attributes.TrackingID);

    const client = await this.soapClient;
    await client.SendStreamAsync({
      Payload: {
        Message: eHubMessages,
      },
    });

    return trackingIds;
  }
}

export interface SendMessage {
  /**
   * The uncompressed xml message
   */
  message: string;

  /**
   * The sending system ID recorded as sender on the EDI Interchange
   *
   * Defaults to config.clientId
   */
  clientId?: string;

  /**
   * The message type. Defaults to "universal-xml"
   */
  type?: "universal-xml" | "native-xml"; // default is universal-xml

  /**
   * This is a GUID you provide.
   *
   * With this id you can look into CW1 EDI Interchange for the status of the message.
   *
   * If not provided, a trackingId will be generated for you.
   */
  trackingId?: string;
}
