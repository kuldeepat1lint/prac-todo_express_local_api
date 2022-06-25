const { writeFile, readFileSync } = require('fs')

let toDo_db = readFileSync('./toDo_db.json', 'utf-8')//local json file
toDo_db = JSON.parse(toDo_db)

// Services/Functionality.....
const getAllTask = (req, res) => {
    return res.json({ status: "success", data: toDo_db })
}

const searchTitle = (req, res) => {
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
}

const getSingleTaskById = (req, res) => {
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
}

const editTask = (req, res) => {
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
        return res.status(200).json({ status: "failed", data: [] })

    writeFile('./toDo_db.json', JSON.stringify(toDo_db), err => {
        if (err)
            console.log(err);
    })
    return res.status(200).json({ status: "success", data: [] })
}

const addTask = (req, res) => {
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
}

const deleteTask = (req, res) => {
    let didDelete = false
    toDo_db = toDo_db.filter(ele => {
        if (ele.id == req.params.id) {
            didDelete = true
            return false
        }
        else
            return true
    })

    if (didDelete === false) {
        console.log(didDelete);
        return res.status(200).json({ status: "failed", data: [] })
    }
    writeFile('./toDo_db.json', JSON.stringify(toDo_db), err => {
        if (err)
            console.log(err);
    })

    return res.status(201).json({ status: "success", data: [] })
}

module.exports = {
    getAllTask,
    searchTitle,
    getSingleTaskById,
    editTask,
    addTask,
    deleteTask
}