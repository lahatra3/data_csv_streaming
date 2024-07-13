import { createReadStream } from "node:fs";
import { createServer } from "node:http";

const PORT = process.env["STREAM_SERVER_PORT"] || 8083;
const STREAM_FILENAME = process.env["STREAM_FILENAME"] || "./local/data/data.csv";

const server = createServer((req, res) => {
    if (req.url === "/data.csv" && req.method === "GET") {
        const reader = createReadStream(STREAM_FILENAME, {
            encoding: "utf-8",
            highWaterMark: 1024 * 1024 * 7,
        });

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/csv");
        reader.pipe(res);

        reader.on("error", (err) => {
            console.error("Error reading file: ", err);
            res.statusCode = 500;
            res.end("Internal Server Error ...");
        });

        res.on("close", () => {
            reader.destroy();
        });
    } else {
        res.statusCode = 404;
        res.end("Not found ...");
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT} ...`);
});
