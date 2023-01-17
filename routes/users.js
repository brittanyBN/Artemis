const express = require('express');
const router = express.Router();
const db = require("../database.js");
const md5 = require("md5");

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"});
});

// GET all users
app.get("/users", (req, res, next) => {
    var sql = "select * from users"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "status": "200",
            "message":"success",
            "data":rows
        })
      });
});

// GET one user by ID
app.get("/user/:id", (req, res, next) => {
    var sql = "select * from users where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "status": "200",
            "message":"success",
            "data":row
        })
      });
});

// Register new user
app.post("/register", (req, res, next) => {
    var errors=[]
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (!req.body.phone){
        errors.push("No phone number specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password : md5(req.body.password)
    }
    var sql ='INSERT INTO users (name, email, phone, password) VALUES (?,?,?,?)'
    var params =[data.name, data.email, data.phone, data.password]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "id": this.lastID,
            "data": data,
        });
    });
});

// Authenticate user

// Update user, find by ID
app.patch("/user/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password : req.body.password ? md5(req.body.password) : null
    }
    db.run(
        `UPDATE users set 
           name = COALESCE(?,name), 
           email = COALESCE(?,email), 
           phone = COALESCE(?, phone),
           password = COALESCE(?,password) 
           WHERE id = ?`,
        [data.id, data.name, data.email, data.phone, data.password, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
})

// Delete user, find by ID
app.delete("/delete/:id", (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
});

module.exports = router;
