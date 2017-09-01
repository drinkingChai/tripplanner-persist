const app = require('express').Router();
const db = require('../db');
const { Day, Hotel, Restaurant, Activity, Place } = db.models;

app.get('/', (req, res, next)=> {
  Day.findAll({
    order: [ 'id' ],
    include: [
      { model: Hotel, include: [ Place ] },
      { model: Restaurant, include: [ Place ] },
      { model: Activity, include: [ Place ] }
    ]
  })
  .then( days => {
    res.send(days);
  })
  .catch(next);
});

app.post('/', (req, res, next)=> {
  Day.create({})
    .then( day => {
      res.send(day);
    });
});

app.delete('/:id', (req, res, next)=> {
  //TODO - implement
  // console.log(req.body);
  Day.findAll()
    .then(days=> {
      if (days.length !== 1) {
        return Day.destroy({ where: { id: req.params.id }})
      }
    }).then(day=> {
      if (!day) console.log('1 left');
      res.sendStatus(200);
    }).catch(next);
});

//TO DO - total of six routes, add and remove hotels, restaurants, activities for a day

app.post('/:dayId/restaurants/:id', (req, res, next)=> {
  let day;
  Day.findOne({ where: { id: req.params.dayId }})
    .then(day=> {
      return Restaurant.findOne({ where: { id: req.params.id }})
    }).then(restaurant=> {
      return day.addRestaurant(restaurant);
    }).then(()=> {
      res.sendStatus(200);
    })
});

app.delete('/:dayId/restaurants/:id', (req, res, next)=> {
  Day.findOne({
    where: { id: req.params.dayId },
    include: [{
      model: Restaurant,
      where: { id: req.params.id }
    }]
  }).then(day=> {
    return day.removeRestaurants(day.restaurants[0]); //, { through: 'days_restaurants' }) apparently not required...???
  }).then(()=> {
    res.sendStatus(200);
  })
});

module.exports = app;
