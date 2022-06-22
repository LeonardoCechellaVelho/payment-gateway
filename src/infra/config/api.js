const env = require('sugar-env')
require('dotenv').config()

module.exports = {
  port: env.get(['API_PORT'], 3000),
  host: env.get(['API_HOST'], '0.0.0.0')
}
