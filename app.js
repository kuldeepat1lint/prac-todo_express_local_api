const express = require('express')
const app = express()
const { writeFile, readFileSync } = require('fs')

const { logger } = require('./middleware.js')

let toDo_db = readFileSync('./toDo_db.json', 'utf-8')//local json file
toDo_db = JSON.parse(toDo_db)

//middleware
app.use(logger)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//temp home page
app.get('/', (req, res) => {
  res.status(200).send('<h1>Home</h1>')
})

//actual app...

//ALL GET REQUESTS
app.get('/api/to-do/', (req, res) => {
  return res.json({ status: "success", data: toDo_db })
})

//SEARCH TITLE
app.get('/api/to-do/search', (req, res) => {
  if (!req.query.q)
    return res.status(200).json({ status: "failed", data: [] })
  else {
    const resData = toDo_db.filter((obj) => {
      if (req.query.q.toLowerCase() === obj.title.toLowerCase()) {
        return true
      }
    })
    res.status(200).json({ status: "success", data: resData })
  }
})

app.get('/api/to-do/:id', (req, res) => {
  //send response according para id
  const resData = toDo_db.find((obj) => {
    if (obj.id === Number(req.params.id)) {
      return true
    }
  })

  if (resData != undefined)
    return res.json({ status: "success", data: [resData] })
  else
    return res.json({ status: "success", data: [] })
})

//POST METHOD
app.patch('/api/to-do/:id', (req, res) => {

  if (req.body.title === undefined
    || req.body.desc === undefined) {
    return res.status(406).json({ stats: "failed", data: [] })
  }

  let didEdit = false
  toDo_db = toDo_db.map((obj) => {
    if (obj.id === Number(req.params.id)) {
      didEdit = true
      obj.title = req.body.title
      obj.desc = req.body.desc
    }
    return obj
  })
  if (didEdit === false)
    return res.status(204).json({ status: "failed", data: [] })

  writeFile('./toDo_db.json', JSON.stringify(toDo_db), err => {
    if (err)
      console.log(err);
  })
  return res.status(200).json({ status: "success", data: [] })
})

//PUT METHOD
app.put('/api/to-do', (req, res) => {
  if (req.body.title === undefined
    || req.body.desc === undefined) {
    return res.status(406).json({ stats: "failed", data: [] })
  }

  let lastIndex = toDo_db.at(-1).id
  toDo_db.push({
    id: lastIndex + 1,
    title: req.body.title,
    desc: req.body.desc
  })

  writeFile('./toDo_db.json', JSON.stringify(toDo_db), err => {
    if (err)
      console.log(err);
  })

  return res.status(201).json({ status: "success", data: [] })
})


//DELETE METHOD
let didDelete = false
app.delete('/api/to-do/:id', (req, res) => {
  toDo_db = toDo_db.filter(ele => {
    if (ele.id == req.params.id) {
      didDelete = true
      return false
    }
    else
      return true
  })

  if (didDelete === false)
    return res.status(204).json({ status: "failed", data: [] })

  writeFile('./toDo_db.json', JSON.stringify(toDo_db), err => {
    if (err)
      console.log(err);
  })

  return res.status(201).json({ status: "success", data: [] })
})


//errors 404
app.all('*', (req, res) => {
  res.status(404).send('<h1>Not Found</h1>')
})


//starting the service
app.listen(3000, () => {
  console.log('server started on 3000....');
})