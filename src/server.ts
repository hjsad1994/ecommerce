import app from "./app";
import envConfig from "./configs/env.config";

const PORT: number = envConfig.PORT;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
    server.close(() => {
        console.log("Server closed");
    });
}); 