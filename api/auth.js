const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Dados incompletos')
        }
        const user = await app.db('user')
            .whereRaw("LOWER(email) = LOWER(?)", req.body.email)
            .first()

        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if (err || !isMatch) {
                    return res.status(401).send('Senha inválida!')
                }

                const payload = { id: user.id }
                res.json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    banner: user.banner,
                    tokenUser: jwt.encode(payload, authSecret),
                })
            })
        } else {
            res.status(400).send('Usuário não cadastrado!')
        }
    }

    return { signin }
}