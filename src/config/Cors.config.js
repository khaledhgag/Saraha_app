export const corsOptions = {
    origin: ["http://localhost:4200", "https://sarahah-app.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,

};