const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const datefn = require('date-fns')

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

/* Getting the URL input parameter */
app.use(bodyParser.urlencoded({ extended: false }));
// Database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

//SCHEMAS
// User schema
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: String
})
const User = mongoose.model('User', userSchema)
// Exercise schema
const exerciseSchema = new Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now() }
})
const Exercise = mongoose.model('Exercise', exerciseSchema)

// CREATE A NEW USER
app.post('/api/users', function(req, res) {
  //check if user it's in the DB
  const inputUser = req.body.username
  User.findOne({ username: inputUser }, function(err, userDoc) {
    if (err) {
      res.json({ err })
    }
    else {
      if (userDoc) {
        res.json(userDoc)
      } else {
        User.create({ username: inputUser }, function(err, newUserDoc) {
          if (err) {
            res.json({ err })
          } else {
            res.json(newUserDoc)
          }
        })
      }
    }
  })
})



// get the list of all users
app.get('/api/users', function(req, res) {
  User.find({}, function(err, data) {
    if (err) {
      res.json({ err })
    } else {
      res.json(data)
    }
  });
})

// add exercises
app.post('/api/users/:_id/exercises', function(req, res) {
  const inputUserId = req.params._id
  User.findById(inputUserId, function(err, userDoc) {
    if (err || !userDoc) {
      res.json({ error: 'user not registered' })
    } else {
      const inputDescription = req.body.description
      const inputDuration = req.body.duration
      if (!inputDuration || !inputDescription) {
        res.json({ error: 'bad request' })
      } else {
        let date = req.body.date
        //validating date
        if (date) {
          date = datefn.parse(date, 'yyyy-MM-dd', new Date())
          if (!(date instanceof Date && !isNaN(date.valueOf()))) {
            res.json('Invalid date')
            return;
          }
        }
        //saving the exercise in the db
        Exercise.create({
          userId: userDoc._id,
          description: inputDescription,
          duration: inputDuration,
          date: date
        }, function(err, newExerDoc) {
          if (err) res.json(err)
          //responding with the user's exercise
          else res.json({
            username: userDoc.username,
            description: newExerDoc.description,
            duration: newExerDoc.duration,
            date: newExerDoc.date.toDateString(),
            _id: userDoc._id
          });
        })
      }
    }
  })
})




//GET request to /api/users/:_id/logs to retrieve a full exercise log of any user.
app.get('/api/users/:_id/logs', function(req, res) {
  let inputId = req.params._id;
  let fromDate = req.query.from;
  let toDate = req.query.to;
  let limit = Number(req.query.limit);

  // Validate the query parameters
    if (fromDate) {
      fromDate = datefn.parse(fromDate, 'yyyy-MM-dd', new Date())
      if (!(fromDate instanceof Date && !isNaN(fromDate.valueOf()))) {
        res.json({ error: 'Invalid date' })
        return;
      }
    }
  if (toDate) {
    toDate = datefn.parse(toDate, 'yyyy-MM-dd', new Date())
    if (!(toDate instanceof Date && !isNaN(toDate.valueOf()))) {
      res.json({ error: 'Invalid date' })
      return;
    }
  }

  // find the user in the userModel collection
  User.findById(inputId, function(err, userDoc) {
    if (err || !userDoc) {
      res.json({ error: 'user not found' })
    }
    else {
      let objResponse = { username: userDoc.username, _id: userDoc.id }
      //initialize a date filter for a date range
      let filterUser = { userId: userDoc._id }
      let filterDate = {}

      //if user gives from date || not
      if (fromDate) {
        objResponse['from'] = fromDate.toDateString()
        filterDate['$gte'] = fromDate
      } else {
        filterDate['$lte'] = new Date(Date.now())
      }
      // if user only gives toDate
      if (toDate) {
        objResponse['to'] = toDate.toDateString()
        filterDate['$lte'] = toDate
      }
      //add the date range to the filter
      if (fromDate || toDate) {
        filterUser['date'] = filterDate;
      }

      //find the exercises and create the log property 
      Exercise.find(filterUser, '-userId').limit(limit).exec(function(err, exerDocs) {
        if (err || !exerDocs) {
          res.json({ error: 'no tracked exercises' })
        }
        else {
          let log = []
          for (let i = 0; i < exerDocs.length; i++) {
            log.push({
              description: exerDocs[i].description,
              duration: exerDocs[i].duration,
              date: exerDocs[i].date.toDateString()
            })
          }
          //add the log and count prop to the obj response
          objResponse['log'] = log;
          objResponse['count'] = exerDocs.length;
          //return the objectResponse with info
          res.json(objResponse)
        }
      })
    }
  })
})

