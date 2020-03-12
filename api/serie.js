const bcrypt = require('bcrypt-nodejs')
const { check, validationResult } = require('express-validator/check');

module.exports = app => {

    const validation = [
        check('name').not().isEmpty().withMessage('Nome não pode ser vazio.'),
        check('description').not().isEmpty().withMessage('Descrição não pode ser vazia.'),
        check('avatar').not().isEmpty().withMessage('Avatar não pode ser vazio.'),
        check('banner').not().isEmpty().withMessage('Banner não pode ser vazio.')
    ]

    const save = (req, res) => {
       
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        app.db('serie')
            .insert({ name: req.body.name, description: req.body.description, avatar: req.body.avatar, banner: req.body.banner })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const get = (req, res) => {

        app.db('serie')
            .select('serie.id', 'serie.name', 'serie.description', 'serie.avatar', 'serie.banner')
            .orderBy('serie.name', 'asc')
            .then(serie => res.json(serie))
            .catch(err => res.status(400).json(err))
    }

    const getById = (req, res) => {
        var bookshelf = require('bookshelf')(app.db)
        var Episodes = bookshelf.Model.extend({
           tableName: 'episodes',
        })
        var Season = bookshelf.Model.extend({
           tableName: 'season',
           episodes: function(){
               return this.hasMany(Episodes,'idSeason','id').orderBy('id', 'ASC')
           }
        })
        var Serie = bookshelf.Model.extend({
           tableName: 'serie',
           season: function(){
               return this.hasMany(Season,'idSerie','id').orderBy('id', 'ASC')
           }
        })
 
        Serie.where({ id: req.params.idSerie }).orderBy('id', 'ASC').fetchAll({withRelated: ['season.episodes']}).then(function(result){
            res.json(result)
        })
    }

    const getBySearch = (req, res) => {
        if(req.body.search == '' || req.body.search == ' ' ){
            app.db('serie')
                .select('serie.id', 'serie.name', 'serie.description', 'serie.avatar', 'serie.banner')
                .orderBy('serie.name', 'asc')
                .then(serie => res.json(serie))
                .catch(err => res.status(400).json(err))
        }else{
            app.db('serie')
                .select('serie.id', 'serie.name', 'serie.description', 'serie.avatar', 'serie.banner')
                .where('serie.name', 'like', `%${req.body.search}%`)
                .orderBy('serie.name', 'asc')
                .then(serie => res.json(serie))
                .catch(err => res.status(400).json(err))
        }
    }

    const update = (req, res) => {
        app.db('serie')
            .where({ id: req.body.idSerie })
            .update({ name: req.body.name, description: req.body.description })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {
        app.db('serie')
            .where({ id: req.params.idSerie })
            .del()
            .then(rowsDeleted => {
                if (rowsDeleted > 0) {
                    res.status(204).send()
                } else {
                    const msg = `Não foi encontrado série com id ${req.params.idSerie}.`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    return { validation, get, getById, getBySearch, save, update, remove }
}
