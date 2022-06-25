const express = require('express')
const router = express.Router()
const controller = require('../controllers/to-do_api_v1')

//ALL GET REQUESTS
router.get('/', controller.getAllTask)

//SEARCH TITLE
router.get('/search/', controller.searchTitle)

router.get('/:id', controller.getSingleTaskById)


router.patch('/:id', controller.editTask)

//PUT METHOD
router.put('/', controller.addTask)


//DELETE METHOD
router.delete('/:id', controller.deleteTask)



module.exports = router