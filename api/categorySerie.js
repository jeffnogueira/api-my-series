const bcrypt = require('bcrypt-nodejs')
const { check, validationResult } = require('express-validator/check');

module.exports = app => {

    const validation = [
        check('idSerie').not().isEmpty().withMessage('Série não pode ser vazia.'),
        check('idCategory').not().isEmpty().withMessage('Categoria não pode ser vazio.')
    ]

    const save = (req, res) => {
       
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        app.db('categorySerie')
            .insert({ idSerie: req.body.idSerie, idCategory: req.body.idCategory })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const get = (req, res) => {

        app.db('categorySerie')
            .select('categorySerie.idSerie', 'categorySerie.idCategory', 'category.description', 
                    'serie.name', 'serie.description', 'serie.avatar', 'serie.banner')
            .innerJoin('category', 'category.id', '=', 'categorySerie.idCategory')
            .innerJoin('serie', 'serie.id', '=', 'categorySerie.idSerie')
            .orderBy('categorySerie.idSerie', 'asc')
            .then(type => res.json(type))
            .catch(err => res.status(400).json(err))
    }

    const getByIdCategory = (req, res) => {

        app.db('categorySerie')
            .select('serie.id', 'serie.name', 'serie.description', 'serie.avatar', 'serie.banner')
            .innerJoin('category', 'category.id', '=', 'categorySerie.idCategory')
            .innerJoin('serie', 'serie.id', '=', 'categorySerie.idSerie')
            .where({ 'categorySerie.idCategory': req.params.idCategory })
            .then(categorySerie => res.json(categorySerie))
            .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {
        app.db('categorySerie')
            .where({ idCategory: req.params.idCategory, idSerie: req.params.idSerie })
            .del()
            .then(rowsDeleted => {
                if (rowsDeleted > 0) {
                    res.status(204).send()
                } else {
                    const msg = `Não foi encontrado categoria com id ${req.params.idCategory} da série com id ${req.params.idSerie}.`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    return { validation, get, getByIdCategory, save, remove }
}
