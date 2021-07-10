import * as http from "http";
import { networkInterfaces } from "os";
import { readFile } from "fs/promises";
import { exec } from "child_process";
import { randomUUID } from "crypto";

const SESSION = new Map();
let uploadPassword;

export function startServer(port, password) {
  Object.entries(networkInterfaces()).forEach(([name, interfaces]) => {
    interfaces
      .filter((iRecord) => iRecord.family === "IPv4")
      .map((result) => console.log(result.address));
  });
  server.listen(port);
  uploadPassword = password;
}
setTimeout(() => {
  exec('curl "http://localhost:2021/"');
}, 200);
const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/login") {
    await performLogin(req, res);
  } else if (req.method === "GET") {
    await serveContent(req, res);
  } else {
    res.statusCode = 400;
    res.end();
  }
});

async function performLogin(req, res) {
  let body = "";
  for await (const chunk of req) body += chunk;
  const formData = new URLSearchParams(body);
  const userPassword = formData.get("password");
  if (userPassword === uploadPassword) {
    const sessionId = randomUUID();
    const sessionExpiryDate = new Date(Date.now() + 5 * 60 * 1000);
    SESSION.set(sessionId, sessionExpiryDate);
    res.setHeader(
      "Set-Cookie",
      [
        `session=${sessionId}`,
        `Expires=${sessionExpiryDate.toISOString()}`,
        'httpOnly'
      ].join(";")
    );
    res.statusCode = 302;
    res.setHeader("Location", `${req.headers.referer}`);
    res.end();
  } else {
    res.statusCode = 401;
    res.end();
  }
}

async function serveContent(req, res) {
  const html = await readFile(new URL("./index.html", import.meta.url), {
    encoding: "utf8",
  });
  const cspNonce = randomUUID();
  res.setHeader("Content-Security-Policy", `script-src 'nonce-${cspNonce}'`);
  res.write(html.replace("NONCE", cspNonce));
  res.end();
}
