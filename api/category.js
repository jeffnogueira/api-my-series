const bcrypt = require('bcrypt-nodejs')
const { check, validationResult } = require('express-validator/check');

module.exports = app => {

    const validation = [
        check('description').not().isEmpty().withMessage('Descrição não pode ser vazia.')
    ]

    const save = (req, res) => {
       
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        app.db('category')
            .insert({ description: req.body.description })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const get = (req, res) => {

        app.db('category')
            .select('category.id', 'category.description')
            .orderBy('category.description', 'asc')
            .then(category => res.json(category))
            .catch(err => res.status(400).json(err))
    }

    const getById = (req, res) => {

        app.db('category')
            .select('category.id', 'category.description')
            .where({ 'category.id': req.params.idCategory })
            .limit(1)
            .then(category => res.json(category[0]))
            .catch(err => res.status(400).json(err))
    }

    const update = (req, res) => {
        app.db('category')
            .where({ id: req.body.idCategory })
            .update({ description: req.body.description })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {
        app.db('category')
            .where({ id: req.params.idCategory })
            .del()
            .then(rowsDeleted => {
                if (rowsDeleted > 0) {
                    res.status(204).send()
                } else {
                    const msg = `Não foi encontrado tipo com id ${req.params.idCategory}.`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    return { validation, get, getById, save, update, remove }
}
