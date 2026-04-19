import envconfig from "../config/env.config.js";

const globalErrorHandler = (err, req, res, next) => {
    console.error(err);

    res.status(err?.cause?.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: envconfig.app.NODE_ENV === 'dev' ? err.stack : undefined
    });
}

export default globalErrorHandler;