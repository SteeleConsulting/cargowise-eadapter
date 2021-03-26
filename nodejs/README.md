# CargoWise-eAdapter

[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue.svg)](https://www.typescriptlang.org)

CargoWise eAdapter client for Node.js

The eAdapter is how you send EDI messages into CW1. It's a picky about how you compress, wrap, and send your XML. This library makes it much easier.

The eAdapter soap service provides 3 methods:

1. Ping - Simply returns true if you are connected.
2. SendStream - How you send messages into CW1.
3. ProcessStream - Deprecated

SendStream does not return anything. It simply accepts your message indicating that CW1 received the message. The way you find out what's happened to your message is by using a tracking ID. The client generates a UUID tracking id and sends it with your message. You can then look in the CW1 EDI Interchange to find the status of your message.

## Example

```js
import { EAdapterClient } from "cargowise-eadapter";

const eAdapter = new EAdapterClient({
  wsdlUrl: "https://.../eAdapterStreamedService.wsdl",
  clientId: "...",
  username: "...",
  password: "...",
});

const xml = `<UniversalInterchange...`;

const [trackingId] = await eAdapter.send([xml]);

console.log(trackingId);
```

## Documentation

The code is well commented and self documenting. For most integrations, you'll just need the EAdapterClient. However, if you need more control over your integration, feel free to pull out the parts you need.

### eAdapter = new EAdapterClient(config)

Simply provide the wsdl url, and authentication credentials to setup an eAdapter client.

See [src/config.ts](./src/config.ts) for more documentation.

### await eAdapter.ping()

Pings the soap service to make sure you are connected and authenticated. It returns true on success. Otherwise, it throws an error.

### trackingIds = await eAdapter.send(messages)

Pass in a list of xml messages you wish to send.

```js
trackingIds = await eAdapter.send([
  // A string is assumed to be a universal XML
  "<UniversalInterchange>...<UniversalShipment...",

  // If you need more specificity you can give an An object describing your message
  {
    message: "<UniversalInterchange>...<Native...",

    // The type of message you wish to send
    type: "native-xml", // Defaults to "universal-xml"

    // The sending system ID recorded as sender on the EDI Interchange
    clientId: "...", // Defaults to config.clientId

    // The UUID to track your message
    trackingId: "...", // When not provided, a UUID will be generated for you
  },
]);
```

See [src/eAdapterClient.ts](./src/eAdapterClient.ts) for more documentation.

## Need help?

We at Steele Consulting have built several large systems that integrate with CW1. We're happy to help. Find us at [steeleconsult.com](https://www.steeleconsult.com/connect/).

## Disclaimer

This is an unofficial/3rd party library not affiliated/sponsored by with CargoWise or WiseTech.

Please refer to the official documentation for most up to date information on how to integrate with CargoWise.

## License

MIT
