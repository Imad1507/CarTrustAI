const axios = require('axios')
const FormData = require('form-data')

async function predictCar(imageBuffer, mimetype) {
    const form = new FormData()
    form.append('image', imageBuffer, { filename: 'image.jpg', contentType: mimetype })
    
    const response = await axios.post('http://localhost:5001/predict', form, {
        headers: form.getHeaders()
    })
    
    return response.data
}

module.exports = { predictCar }