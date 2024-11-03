export const errorHandler = (err, req, res, next) => {
    err.statusCode = res.statusCode = err.status || 500;
    console.log(err);

    if (err.code === 11000) {
        err.statusCode = 400;
        for (let i in err.keyValue) {
            err.message = `Your ${i} already exists`;
        }
    }
    if (err.kind === 'ObjectId') {
        err.statusCode = 404;
        err.message = `The ${req.originalUrl} is not found because of wrong ID`;
    }
    if (err.errors) {
        err.statusCode = 400;
        err.message = [];
        for (let i in err.errors) {
            err.message.push(err.errors[i].message);
        }
    }
    res.status(err.statusCode).json({
        status: 'ERROR',
        message: err.message,
    });
};

