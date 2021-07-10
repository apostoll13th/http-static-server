import { startServer } from "./server.js";

const PORT = process.env.PORT || 2021;
const password = process.env.PASSWORD || 'anakonda'
startServer(PORT, password);


