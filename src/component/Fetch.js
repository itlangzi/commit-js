export default (...args) => fetch(...args)
    .then(response => {
        if (response.ok) {
            return Promise.resolve(response)
        }
        const error = new Error(response.statusText)
        error.status = response.status
        return Promise.reject(error)
    })
    .catch(error => {
        if (error.status) {
            return Promise.reject(error)
        }
        return Promise.reject(new Error('Error Connection Refused'))
    })