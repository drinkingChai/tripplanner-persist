const express = require('express');
const path = require('path');
const swig = require('swig');
swig.setDefaults({ cache: false });
const db = require('./db');
const { Day, Hotel, Restaurant, Activity, Place } = db.models;

const app = express();
app.set('view engine', 'html');
app.engine('html', swig.renderFile);

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));

let config = process.env;
try {
  config = require('./env.json');
}
catch(ex){

}
app.use(function(req, res, next){
  res.locals.GOOGLE_API_KEY = config.GOOGLE_API_KEY;
  next();
});

app.use('/days', require('./routes/days'));


app.get('/', (req, res, next)=> {
  const options = {
    include: [ Place ]
  }

  Promise.all([
    Hotel.findAll(options),
    Restaurant.findAll(options),
    Activity.findAll(options)
  ])
  .then(([ hotels, restaurants, activities ])=> {
    res.render('index', { hotels, restaurants, activities });
  })
  .catch(next);
});

app.use((req, res, next)=> {
  const error = new Error('page not found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next)=> {
  res.status(err.status || 500).render('error', { error: err });
});

const port = process.env.PORT || 3000;
db.sync()
  .then(()=> db.seed())
  .then( result => {
    //console.log(result);
  })
  .then(()=> {
    app.listen(port, ()=> {
      console.log(`listening on port ${port}`);
    });
  });
