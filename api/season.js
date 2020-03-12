const bcrypt = require('bcrypt-nodejs')
const { check, validationResult } = require('express-validator/check');

module.exports = app => {

    const validation = [
        check('idSerie').not().isEmpty().withMessage('Série não pode ser vazio.'),
        check('description').not().isEmpty().withMessage('Descrição não pode ser vazia.'),
        check('number').not().isEmpty().withMessage('Número da temporada não pode ser vazio.')
    ]

    const save = (req, res) => {
       
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        app.db('season')
            .insert({ idSerie: req.body.idSerie, description: req.body.description, number: req.body.number })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const get = (req, res) => {

        app.db('season')
            .select('season.id', 'season.idSerie', 'season.description', 'season.number', 'serie.name', 
                    'serie.description', 'serie.avatar', 'serie.banner')
            .innerJoin('serie', 'serie.id', '=', 'season.idSerie')
            .orderBy('season.id', 'asc')
            .then(season => res.json(season))
            .catch(err => res.status(400).json(err))
    }

    const getById = (req, res) => {

        app.db('season')
            .select('season.id', 'season.idSerie', 'season.description', 'season.number', 'serie.name', 
                    'serie.description', 'serie.avatar', 'serie.banner')
            .innerJoin('serie', 'serie.id', '=', 'season.idSerie')
            .where({ 'season.id': req.params.idSerie })
            .limit(1)
            .then(season => res.json(season[0]))
            .catch(err => res.status(400).json(err))
    }

    const update = (req, res) => {
        app.db('season')
            .where({ id: req.body.idSeason })
            .update({ idSerie: req.body.idSerie, number: req.body.number, description: req.body.description })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {
        app.db('season')
            .where({ id: req.params.idSeason })
            .del()
            .then(rowsDeleted => {
                if (rowsDeleted > 0) {
                    res.status(204).send()
                } else {
                    const msg = `Não foi encontrado temporada com id ${req.params.idSeason}.`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    return { validation, get, getById, save, update, remove }
}
