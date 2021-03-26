import * as zlib from "zlib";

/**
 * Before sending an message string through the eAdapter, it needs to be gzipped and base64 encoded.
 *
 * @param message the xml string you wish to compress.
 * @returns a promise resolving the compressed base64 string.
 */
export async function compressMessage(message: string): Promise<string> {
  const input = Buffer.from(message, "utf8");
  return new Promise((resolve, reject) =>
    zlib.gzip(
      input,
      {
        level: 1,
        windowBits: 9,
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        const output = result.toString("base64");

        resolve(output);
      }
    )
  );
}
