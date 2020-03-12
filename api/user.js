const bcrypt = require('bcrypt-nodejs')
const { check, validationResult } = require('express-validator/check');

module.exports = app => {
    const obterHash = (password, callback) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, null, (err, hash) => callback(hash))
        })
    }

    const validation = [
        check('name').not().isEmpty().withMessage('Nome não pode ser vazio.'),
        check('email').isEmail().withMessage('Email não válido.'),
        check('password').isLength({ min: 6 }).withMessage('Mínimo de 6 caracteres.')
    ]

    const save = (req, res) => {
       
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        obterHash(req.body.password, hash => {
            const password = hash

            app.db('user')
                .insert({ name: req.body.name, email: req.body.email, password, avatar: req.body.avatar, banner: req.body.banner,  })
                .then(_ => res.status(204).send())
                .catch(err => res.status(400).json(err))
        })
    }

    const get = (req, res) => {

        app.db('user')
            .select('user.id', 'user.name', 'user.email', 'user.avatar', 'user.banner')
            .orderBy('user.id', 'desc')
            .then(user => res.json(user))
            .catch(err => res.status(400).json(err))
    }

    const getById = (req, res) => {

        app.db('user')
            .select('user.id', 'user.name', 'user.email', 'user.avatar', 'user.banner')
            .where({ 'user.id': req.params.idUser })
            .limit(1)
            .then(user => res.json(user[0]))
            .catch(err => res.status(400).json(err))
    }

    const update = (req, res) => {
        if(req.body.password == ""){
            app.db('user')
                .where({ id: req.body.idUser })
                .update({ name: req.body.name, email: req.body.email })
                .then(_ => res.status(204).send())
                .catch(err => res.status(400).json(err))
        }else{
            obterHash(req.body.password, hash => {
                const password = hash
                app.db('user')
                    .where({ id: req.body.idUser })
                    .update({ name: req.body.name, email: req.body.email, password: password })
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(400).json(err))
            })
        }
    }

    const updateAvatar = (req, res) => {
        app.db('user')
            .where({ id: req.body.idUser })
            .update({ avatar: req.body.avatar })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const updateBanner = (req, res) => {
        app.db('user')
            .where({ id: req.body.idUser })
            .update({ banner: req.body.banner })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {
        app.db('user')
            .where({ id: req.params.idUser })
            .del()
            .then(rowsDeleted => {
                if (rowsDeleted > 0) {
                    res.status(204).send()
                } else {
                    const msg = `Não foi encontrado usuário com id ${req.params.idUser}.`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    return { validation, get, getById, save, update, updateAvatar, updateBanner, remove }
}
