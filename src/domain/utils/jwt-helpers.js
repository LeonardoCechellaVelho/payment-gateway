const herbarium = require('@herbsjs/herbarium');
const jwt = require('jsonwebtoken')

module.exports = function jwtTokens({id, name, email, document}) {
    const user = {id, name, email, document};
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    return accessToken;
};
