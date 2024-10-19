interface ErrorResponse {
    statusCode: number;
    name: string;
    message: string;
    error?: any;
}

const errorCodes = [400, 401, 403, 404, 429, 409, 500];

export const handleError = (error: any): ErrorResponse => {
    const statusCode = error.response?.status || 500;
    const err: ErrorResponse = error.response?.data?.error || {
        statusCode: 500,
        name: 'NetworkError',
        message: 'potential network failure',
        error: error
    };

    if (!errorCodes.includes(statusCode)) err.statusCode = 500;

    if (err.statusCode === 401) {
        if (err.name === 'UnauthorizedError' && err.message === 'Authorization header not found.') {
            window.location.href = '/auth/login';
        }
    }

    return err;
};
