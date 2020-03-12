const bcrypt = require('bcrypt-nodejs')
const { check, validationResult } = require('express-validator/check');

module.exports = app => {

    const validation = [
        check('idSeason').not().isEmpty().withMessage('Temporada não pode ser vazia.'),
        check('description').not().isEmpty().withMessage('Descrição não pode ser vazia.'),
        check('number').not().isEmpty().withMessage('Número da temporada não pode ser vazio.'),
        check('releaseDate').not().isEmpty().withMessage('Data de lançamento não pode ser vazio.'),
        check('duration').not().isEmpty().withMessage('tempo de duração não pode ser vazio.')
    ]

    const save = (req, res) => {
       
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        app.db('episodes')
            .insert({ idSeason: req.body.idSeason, description: req.body.description, number: req.body.number, 
                    releaseDate: req.body.releaseDate, duration: req.body.duration })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const get = (req, res) => {

        app.db('episodes')
            .select('episodes.id', 'episodes.idSeason', 'episodes.number', 'episodes.description', 
                    'episodes.releaseDate', 'episodes.duration', 'season.idSerie', 'season.description', 
                    'season.number', 'serie.name', 'serie.description', 'serie.avatar', 'serie.banner')
            .innerJoin('season', 'season.id', '=', 'episodes.idSeason')
            .innerJoin('serie', 'serie.id', '=', 'season.idSerie')
            .orderBy('episodes.id', 'asc')
            .then(episodes => res.json(episodes))
            .catch(err => res.status(400).json(err))
    }

    const getById = (req, res) => {

        app.db('episodes')
            .select('episodes.id', 'episodes.idSeason', 'episodes.number', 'episodes.description', 
                    'episodes.releaseDate', 'episodes.duration', 'season.idSerie', 'season.description', 
                    'season.number', 'serie.name', 'serie.description', 'serie.avatar', 'serie.banner')
            .innerJoin('season', 'season.id', '=', 'episodes.idSeason')
            .innerJoin('serie', 'serie.id', '=', 'season.idSerie')
            .where({ 'episodes.id': req.params.idEpisodes })
            .limit(1)
            .then(episodes => res.json(episodes[0]))
            .catch(err => res.status(400).json(err))
    }

    const update = (req, res) => {
        app.db('episodes')
            .where({ id: req.body.idEpisodes })
            .update({ idSeason: req.body.idSeason, description: req.body.description, number: req.body.number, 
                releaseDate: req.body.releaseDate, duration: req.body.duration })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {
        app.db('episodes')
            .where({ id: req.params.idEpisodes })
            .del()
            .then(rowsDeleted => {
                if (rowsDeleted > 0) {
                    res.status(204).send()
                } else {
                    const msg = `Não foi encontrado temporada com id ${req.params.idEpisodes}.`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    return { validation, get, getById, save, update, remove }
}
