const crypto = require('crypto').randomBytes(256).toString('hex')

module.exports = {
    uri : `momongodb://localhost/${this.db}`,
    secret : crypto,
    db : 'meanAngularTwo'
}