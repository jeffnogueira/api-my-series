module.exports = app => {
    app.post('/auth/login', app.api.auth.signin)

    app.route('/user')
        .all(app.config.passport.authenticate())   
        .get(app.api.user.get)
        .post(app.api.user.validation, app.api.user.save)
        .put(app.api.user.validation, app.api.user.update)
    
    app.route('/user/avatar')
        .all(app.config.passport.authenticate())   
        .put(app.api.user.validation, app.api.user.updateAvatar)

    app.route('/user/banner')
        .all(app.config.passport.authenticate())   
        .put(app.api.user.validation, app.api.user.updateBanner)

    app.route('/user/:idUser')
        .all(app.config.passport.authenticate())   
        .get(app.api.user.getById)
        .delete(app.api.user.remove)


    app.route('/serie')
        .all(app.config.passport.authenticate())   
        .get(app.api.serie.get)
        .post(app.api.serie.validation, app.api.serie.save)
        .put(app.api.serie.validation, app.api.serie.update)

    app.route('/serie/pesquisa')
        .all(app.config.passport.authenticate())   
        .post(app.api.serie.getBySearch)

    app.route('/serie/:idSerie')
        .all(app.config.passport.authenticate())   
        .get(app.api.serie.getById)
        .delete(app.api.serie.remove)


        
    app.route('/season')
        .all(app.config.passport.authenticate())   
        .get(app.api.season.get)
        .post(app.api.season.validation, app.api.season.save)
        .put(app.api.season.validation, app.api.season.update)

    app.route('/season/:idSeason')
        .all(app.config.passport.authenticate())   
        .get(app.api.season.getById)
        .delete(app.api.season.remove)


        
    app.route('/episodes')
        .all(app.config.passport.authenticate())   
        .get(app.api.episodes.get)
        .post(app.api.episodes.validation, app.api.episodes.save)
        .put(app.api.episodes.validation, app.api.episodes.update)

    app.route('/episodes/:idEpisodes')
        .all(app.config.passport.authenticate())   
        .get(app.api.episodes.getById)
        .delete(app.api.episodes.remove)


        
    app.route('/userSerie/:idUser')
        .all(app.config.passport.authenticate())   
        .get(app.api.userSerie.get)

    app.route('/userSerie/nextEpisodes/:idUser')
        .all(app.config.passport.authenticate())   
        .get(app.api.userSerie.getNextEpisodes)
    
    app.route('/userSerie/episodes/:idUser')
        .all(app.config.passport.authenticate())   
        .get(app.api.userSerie.getEpisodesById)

    app.route('/userSerie/:idUser/:idSerie/:idSeason/:idEpisodes')
        .all(app.config.passport.authenticate()) 
        .post(app.api.userSerie.save)
        .delete(app.api.userSerie.remove)


    
    app.route('/category')
        .all(app.config.passport.authenticate())   
        .get(app.api.category.get)
        .post(app.api.category.validation, app.api.category.save)
        .put(app.api.category.validation, app.api.category.update)

    app.route('/category/:idCategory')
        .all(app.config.passport.authenticate())   
        .get(app.api.category.getById)
        .delete(app.api.category.remove)


    
    app.route('/categorySerie')
        .all(app.config.passport.authenticate())   
        .get(app.api.categorySerie.get)
        .post(app.api.categorySerie.validation, app.api.categorySerie.save)

    app.route('/categorySerie/:idCategory')
        .all(app.config.passport.authenticate())   
        .get(app.api.categorySerie.getByIdCategory)

    app.route('/categorySerie/:idCategory/:idSerie')
        .all(app.config.passport.authenticate())   
        .delete(app.api.categorySerie.remove)
    
}
