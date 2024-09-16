import express from "express";
import readline from "readline";
import router from "./routes/api.js";
import { Database } from "./database/db.js";
import { BASE_URL, PORT } from "./constants.js";
import { requestLogger } from "./middlewares/logger/loggers.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(BASE_URL, router);

app.on("close", async () => {
    await Database.getInstance()
        .close()
        .then(() => console.log("Database saved"));
    console.log("Server connection closed");
    process.exit();
});

app.listen(PORT, "0.0.0.0", async () => {
    await Database.getInstance()
        .init()
        .then(() => console.log("Database initialized"))
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
    console.log(`Server is running on port: ${PORT}`);
});

if (process.platform === "win32") {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.on("SIGINT", () => {
        process.emit("SIGINT");
    });
}

process.on("SIGINT", () => {
    app.emit("close");
});
