const router = require('express').Router();
const passport = require('passport');



const {CreateArticle ,UpdateArticle ,DeleteArticle, GetArticle,GetArticles} = require('../controllers/article.controller');



router.get('/', passport.authenticate('jwt' , {session : false}), GetArticles )
router.post('/create', passport.authenticate('jwt' , {session : false}), CreateArticle )
router.get('/:id', passport.authenticate('jwt' , {session : false}), GetArticle )
router.delete('/delete/:id', passport.authenticate('jwt' , {session : false}), DeleteArticle )
router.put('/update/:id', passport.authenticate('jwt' , {session : false}), UpdateArticle ) 









module.exports = router;