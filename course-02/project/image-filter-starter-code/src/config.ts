const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

export const config = {
    "jwt_key": process.env.JWT_KEY
}
