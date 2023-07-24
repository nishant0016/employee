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
const {Client} = require("pg");
const client = new Client({
    user:"postgres",
    password:"7037700!!4nN",
    database:"postgres",
    port:5432,
    host:"db.fnmbkbheapxlvopfeiic.supabase.co",
    ssl:{rejectUnauthorized:false},
});
client.connect(function(res,error){
    console.log("Connected!!")
})
var port=process.env.PORT||2410;
app.listen(port,()=>console.log(`Node app listening on port ${port}!`));



app.get("/employees",function(req,res){
    let department=req.query.department;
    let designation=req.query.designation;
    let gender=req.query.gender;
    let sql="SELECT * FROM employees";
    console.log("Inside get");
    client.query(sql,function(err,result){
        if (err) res.status(404).send(err);
        else {
            let arr1=result.rows;
            arr1 = department?arr1.filter(em=>em.department===department):arr1;
            arr1 = designation?arr1.filter(em=>em.designation===designation):arr1;
            arr1 = gender?arr1.filter(em=>em.gender===gender):arr1;
            res.send(arr1);
        }
    });
});
app.get("/employee/:id",function(req,res){
    let id = req.params.id;
    console.log("Inside get",id);
    let sql1="SELECT * FROM employees WHERE empcode=$1";
    const params=[id];
    client.query(sql1,params,function(err,result1){
        if (err) {
            res.status(404).send(err);}
        else {
            res.send(result1.rows);}
    })
   
})
app.get("/employees/department/:deptName",function(req,res){
    let deptName=req.params.deptName;
    let sql="SELECT * FROM employees WHERE department=$1";
    const params=[deptName]
    client.query(sql,params,function(err,result){
        if (err) res.status(404).send(err);
        else res.send(result.rows);
    });
})

app.get("/employees/designation/:desgName",function(req,res){
    let desgName=req.params.desgName;
    let sql="SELECT * FROM employees WHERE designation=$1";
    const params=[desgName];
    client.query(sql,params,function(err,result){
        if (err) res.status(404).send(err);
        else res.send(result.rows);
    });
});


app.post("/employees", function (req, res) {
    let body = req.body;
    let arr = [body.empCode, body.name, body.department, body.designation, body.salary, body.gender];
    let sql = "INSERT INTO employees (empCode, name, department, designation, salary, gender) VALUES ($1,$2, $3, $4, $5, $6)";
    console.log("inside post");
    client.query(sql, arr, function (err) {
      if (err) {
        console.log(err);
        res.status(404).send(err);
      } else {
        let sql1 = "SELECT * FROM employees WHERE empCode = $1";
        client.query(sql1, [body.empCode], function (err, result) {
          if (err) {
            res.status(404).send(err);
          } else {
            res.send(result.rows);
          }
        });
      }
    });
  });

app.delete("/employees/:id",function(req,res){
    let id = req.params.id;
    let params=[id];
    console.log("inside Delete")
    let sql="DELETE FROM employees WHERE empcode=$1";
    client.query(sql,params,function(err,result){
        if (err) {
            console.log(err);
            res.status(404).send(err);}
        else res.send("Data Delete")
    })
});

app.put("/employees/:id",function(req,res){
    let id=req.params.id;
    let body=req.body;
    let params=[id]
    console.log("inside Put")
    let sql="UPDATE employees SET name=$1, department=$2, designation=$3, salary=$4, gender=$5 WHERE empCode=$6"
    let arr=[body.name, body.department, body.designation, body.salary, body.gender,id];
    client.query(sql,arr,function(err,result){
        if (err) {
            console.log(err);
            res.status(404).send(err);}
        else {
            let sql1="SELECT * FROM employees WHERE empCode=$1";
            client.query(sql1,params,function(err,result1){
                if (err) {
                    console.log(err)
                    res.status(404).send(err);}
                else res.send(result1.rows);
            })
        }
    })
})

