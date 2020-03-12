const bodyParser = require('body-parser')
const cors = require('cors')
//const connect = require('connect')

module.exports = app => {
    app.use(bodyParser.urlencoded({
	    extended: false
	}))
    app.use(bodyParser.json())
    app.use(cors({
        origin: '*'
    }))
}