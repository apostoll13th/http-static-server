import * as http from "http";
import { networkInterfaces } from "os";
export function startServer(port) {
  Object.entries(networkInterfaces()).forEach(([name, interfaces]) => {
    interfaces
      .filter((iRecord) => iRecord.family === "IPv4")
      .map((result) => console.log(result.address));
  });
  server.listen(port);
}

const server = http.createServer((req, res) => {
  res.end("heelo motherfucker");
});
