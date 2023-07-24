let express =require("express");
let app = express();
app.use(express.json());
app.use(function (req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With,Content-Type,Accept"
    );
    next();
})
var port=process.env.PORT||2410;
app.listen(port,()=>console.log(`Node app listening on port ${port}!`));

let mysql=require("mysql");

let connData={
    host:"localhost",
    user:"root",
    password:"",
    database:"employeesdb",
};

app.get("/employees",function(req,res){
    let department=req.query.department;
    let designation=req.query.designation;
    let gender=req.query.gender;
    let connection=mysql.createConnection(connData);
    let sql="SELECT * FROM employees";
    connection.query(sql,function(err,result){
        if (err) res.status(404).send(err);
        else {
            let arr1=result;
            arr1 = department?arr1.filter(em=>em.department===department):arr1;
            arr1 = designation?arr1.filter(em=>em.designation===designation):arr1;
            arr1 = gender?arr1.filter(em=>em.gender===gender):arr1;
            res.send(arr1);
        }
    });
});
app.get("/employee/:id",function(req,res){
    let id = req.params.id;
    let connection=mysql.createConnection(connData);
    let sql1="SELECT * FROM employees WHERE empCode=(?)";
    connection.query(sql1,id,function(err,result1){
        if (err) res.status(404).send(err);
        else res.send(result1);
    })
})
app.get("/employees/department/:deptName",function(req,res){
    let deptName=req.params.deptName;
    let connection=mysql.createConnection(connData);
    let sql="SELECT * FROM employees WHERE department=(?)";
    connection.query(sql,deptName,function(err,result){
        if (err) res.status(404).send(err);
        else res.send(result);
    });
})

app.get("/employees/designation/:desgName",function(req,res){
    let desgName=req.params.desgName;
    let connection=mysql.createConnection(connData);
    let sql="SELECT * FROM employees WHERE designation=(?)";
    connection.query(sql,desgName,function(err,result){
        if (err) res.status(404).send(err);
        else res.send(result);
    });
});

app.post("/employees", function (req, res) {
    let body = req.body;
    let connection = mysql.createConnection(connData);
    let arr = [body.empCode, body.name, body.department, body.designation, body.salary, body.gender];
    let sql = "INSERT INTO employees (empCode, name, department, designation, salary, gender) VALUES (?, ?, ?, ?, ?, ?)";

    connection.query(sql, arr, function (err, result) {
        if (err) {
            res.status(404).send(err);
        } else {
            let sql1 = "SELECT * FROM employees WHERE empCode = ?";
            connection.query(sql1, body.empCode, function (err, result) {
                if (err) {
                    res.status(404).send(err);
                } else {
                    res.send(result);
                }
            });
        }
    });
});

app.delete("/employees/:id",function(req,res){
    let id = req.params.id;
    let connection=mysql.createConnection(connData);
    let sql="DELETE FROM employees WHERE empCode=(?)";
    connection.query(sql,id,function(err,result){
        if (err) res.status(404).send(err);
        else res.send("Data Delete")
    })
});

app.put("/employees/:id",function(req,res){
    let id=req.params.id;
    let body=req.body;
    let connection=mysql.createConnection(connData);
    let sql="UPDATE employees SET name=?, department=?, designation=?, salary=?, gender=?WHERE empCode=?"
    let arr=[body.name, body.department, body.designation, body.salary, body.gender,id];
    connection.query(sql,arr,function(err,result){
        if (err) res.status(404).send(err);
        else {
            let sql1="SELECT * FROM employees WHERE empCode=(?)";
            connection.query(sql1,id,function(err,result1){
                if (err) res.status(404).send(err);
                else res.send(result1);
            })
        }
    })
})

