export const welcome = (req, res, next) => {
    try {
        res.status(200).json({
            status: "success",
            message: "Welcome to Pawn"
        })
    } catch (error) {
        next(error);
    }
}