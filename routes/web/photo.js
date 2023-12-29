var express = require('express');
var router = express.Router();

const WallModel = require('../../models/WallModel');

const id = "657a90347c9d2e1e93ef10f2";

/* GET home page. */
router.get('/wall/:id', (req, res, next) => {
  const {id} = req.params;
  WallModel.findById(id).then((data)=>{
    console.log(data);
    if (!data){
      res.status(404).send("Connot Found");
      return;
    }
    res.render('photo', {title: data.wallName, url: data.logo, id: data._id});
  })
});

router.get('/upload', (req, res, next) => {
  res.render('upload');
})

router.get('/', (req, res, next) => {
  res.render('index', {isLogin: Boolean(req.session._id)});
})

module.exports = router;
