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
    })
    .catch(next);
});

app.delete('/:id', (req, res, next)=> {
  //TODO - implement
  // console.log(req.body);
  Day.findAll()
    .then(days=> {
      if (days.length !== 1) {
        return Day.destroy({ where: { id: req.params.id }})
      }
    })
    .then(day=> {
      if (!day) console.log('1 left');
      res.sendStatus(200);
    })
    .catch(next);
});

//TO DO - total of six routes, add and remove hotels, restaurants, activities for a day

app.post('/:dayId/restaurants/:id', (req, res, next)=> {
  let day;
  Day.findOne({ where: { id: req.params.dayId }})
    .then(_day=> {
      day = _day;
      return Restaurant.findOne({ where: { id: req.params.id }})
    })
    .then(restaurant=> {
      return day.addRestaurants(restaurant); //, { through: 'days_restaurants' }); ????
    })
    .then(day=> {
      res.send(day);
    })
    .catch(next);
});

app.post('/:dayId/hotels/:id', (req, res, next)=> {
  let day;
  Day.findOne({
    where: { id: req.params.dayId },
    include: [ Hotel ]
  })
  .then(_day=> {
    day = _day;
    if (day.hotels.length) return;
    return Hotel.findOne({ where: { id: req.params.id }})
  })
  .then(hotel=> {
    if (!hotel) return;
    return day.addHotels(hotel); //, { through: 'days_restaurants' }); ????
  })
  .then(day=> {
    res.send(day);
  })
  .catch(next);
});

app.post('/:dayId/activities/:id', (req, res, next)=> {
  let day;
  Day.findOne({ where: { id: req.params.dayId }})
    .then(_day=> {
      day = _day;
      return Activity.findOne({ where: { id: req.params.id }})
    })
    .then(activity=> {
      return day.addActivities(activity); //, { through: 'days_restaurants' }); ????
    })
    .then(day=> {
      res.send(day);
    })
    .catch(next);
});

app.delete('/:dayId/restaurants/:id', (req, res, next)=> {
  Day.findOne({
    where: { id: req.params.dayId },
    include: [{
      model: Restaurant,
      where: { id: req.params.id }
    }]
  })
  .then(day=> {
    return day.removeRestaurants(day.restaurants[0]); //, { through: 'days_restaurants' }) apparently not required...???
  })
  .then(()=> {
    res.sendStatus(200);
  })
  .catch(next);
});

app.delete('/:dayId/hotels/:id', (req, res, next)=> {
  Day.findOne({
    where: { id: req.params.dayId },
    include: [{
      model: Hotel,
      where: { id: req.params.id }
    }]
  })
  .then(day=> {
    return day.removeHotels(day.hotels[0]); //, { through: 'days_restaurants' }) apparently not required...???
  })
  .then(()=> {
    res.sendStatus(200);
  })
  .catch(next);
});

app.delete('/:dayId/activities/:id', (req, res, next)=> {
  Day.findOne({
    where: { id: req.params.dayId },
    include: [{
      model: Activity,
      where: { id: req.params.id }
    }]
  })
  .then(day=> {
    return day.removeActivities(day.activities[0]); //, { through: 'days_restaurants' }) apparently not required...???
  })
  .then(()=> {
    res.sendStatus(200);
  })
  .catch(next);
});

module.exports = app;
