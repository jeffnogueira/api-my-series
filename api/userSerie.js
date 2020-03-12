const bcrypt = require('bcrypt-nodejs')
const { check, validationResult } = require('express-validator/check');

module.exports = app => {

    const save = (req, res) => {

        app.db('userSerie')
            .insert({ idUser: req.params.idUser, idSerie: req.params.idSerie, idSeason: req.params.idSeason, 
                    idEpisodes: req.params.idEpisodes })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const get = (req, res) => {

        app.db('userSerie')
            .select('serie.id', 'serie.name', 'serie.description', 'serie.avatar', 'serie.banner')
            .innerJoin('serie', 'serie.id', '=', 'userSerie.idSerie')
            .where({ 'userSerie.idUser': req.params.idUser })
            .orderBy('userSerie.idUser', 'desc')
            .groupBy('userSerie.idUser','userSerie.idSerie')
            .then(serie => res.json(serie))
            .catch(err => res.status(400).json(err))
    }

    const getNextEpisodes = (req, res) => {

        app.db('episodes')
            .select('serie.id as idSerie', 'serie.name', 'serie.avatar', 'episodes.id as idEpisode', 'episodes.title', 
                    'episodes.releaseDate')
            .innerJoin('season', 'season.id', '=', 'episodes.idSeason')
            .innerJoin('serie', 'serie.id', '=', 'season.idSerie')
            .whereNotIn('episodes.id', [app.db('userSerie').select('userSerie.idEpisodes').where({ 'userSerie.idUser': req.params.idUser })])
            .groupBy('serie.id','episodes.id')
            .orderBy('episodes.releaseDate', 'asc')
            .limit(50)
            .then(serie => res.json(serie))
            .catch(err => res.status(400).json(err))
    }

    const getEpisodesById = (req, res) => {

        app.db('userSerie')
            .select('userSerie.idEpisodes')
            .where({ 'userSerie.idUser': req.params.idUser })
            .then(userSerie => res.json(userSerie))
            .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {
        app.db('userSerie')
            .where({ idUser: req.params.idUser, idSerie: req.params.idSerie, idSeason: req.params.idSeason, 
                idEpisodes: req.params.idEpisodes })
            .del()
            .then(rowsDeleted => {
                if (rowsDeleted > 0) {
                    res.status(204).send()
                } else {
                    const msg = `Não foi encontrado série com id ${req.params.idSerie} e usúario com id ${req.params.idUser}.`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    return { get, getEpisodesById, getNextEpisodes, save, remove }
}
