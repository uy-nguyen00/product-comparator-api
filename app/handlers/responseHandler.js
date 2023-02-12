function handleResponse(response, req, res) {
    res.status(response.status).json({
        [response.type]: response.message
    });
}

module.exports = {
    handleResponse: handleResponse
}