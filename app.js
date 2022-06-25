const express = require('express')
const app = express()
const apiV1 = require('./routes/to-do_api_v1')
const { logger } = require('./middleware.js')

//middleware
app.use(logger)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//temp home page
app.get('/', (req, res) => {
  res.status(200).send('<h1>Home</h1>')
})

//api v1 route
app.use('/api/v1/to-do', apiV1)

//errors 404
app.all('*', (req, res) => {
  res.status(404).send('<h1>Not Found</h1>')
})

//starting the service
app.listen(3000, () => {
  console.log('server started on 3000....');
})