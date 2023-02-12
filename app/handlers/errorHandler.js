function handleError(error, req, res) {
    const status = error.response.status;
    const message = error.message;
    res.status(status).json({error: message});
}

module.exports = {
    handleError: handleError
}