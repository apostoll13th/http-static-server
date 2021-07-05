import * as http from "http";
import { networkInterfaces } from "os";
import { readFile } from "fs/promises";
import { exec } from "child_process";
export function startServer(port) {
  Object.entries(networkInterfaces()).forEach(([name, interfaces]) => {
    interfaces
      .filter((iRecord) => iRecord.family === "IPv4")
      .map((result) => console.log(result.address));
  });
  server.listen(port);
}
setTimeout(() => {
  exec('curl "http://localhost:2021/"');
}, 200);
const server = http.createServer(async (req, res) => {
  const html = await readFile(new URL("./index.html", import.meta.url));
  res.end(html);
});
