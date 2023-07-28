const express  = require('express')
const cors = require('cors')
const { Pool } = require("pg");


const app = express()
app.use(cors())
app.use(express.json())

const PORT  = process.env.PORT || 8080 

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "pass123",
  database: "crudoperation",
  port: "5432",
});


//schema
// const schemaData  = mongoose.Schema({
//     name : String,
//     email : String,
//     mobile : String,
// },{
//     timestamps : true
// })

//const userModel  = mongoose.model("user",schemaData)


app.get("/",async(req,res)=>{
    // const data = await userModel.find({})
    // res.json({success : true , data : data})
    const response = await pool.query('SELECT * FROM users ORDER BY id ASC');
    console.log(response.rows);
  try {
    const response = await pool.query("SELECT name, email, mob FROM users ORDER BY id ASC");
    res.status(200).json(response.rows);
  } catch (err) {
    res.json(err);
  }
})  



app.post("/create",async(req,res)=>{
    // console.log(req.body)
    // const data = new userModel(req.body)
    // await data.save()
    // res.send({success : true, message : "data save successfully" , data : data})

    try {
	const { id, name, email, mob } = req.body;
	const response = await pool.query(
	    "INSERT INTO users (name, email, mob) VALUES ($2, $3, $4)",
	    [id, name, email, mob]
	);
	res.json({
	    message: "A new person was created",
	    body: {
		user: { id, name, email, mob },
	    },
	});
    } catch (err) {
	res.json(err);
    }
})



app.put("/update",async(req,res)=>{
    // console.log(req.body)
    // const { _id,...rest} = req.body 

    // console.log(rest)
    // const data = await userModel.updateOne({ _id : _id},rest)
    // res.send({success : true, message : "data update successfully", data : data})

    try {
    const ID = parseInt(req.params.id);
    const { id,name,email,mob } = req.body;

    const response = await pool.query(
      "UPDATE users SET name = $1, email = $2, mom = $3 WHERE id = $4",
      [name, email, mob, id]
    );
    console.log(response);
    res.json("Person updated in the contact");
  } catch (err) {
    res.json(err);
  }
})

//delete api
// http://localhost:8080/delete/id


app.delete("/delete/:id",async(req,res)=>{
    // const id = req.params.id
    // console.log(id)
    // const data = await userModel.deleteOne({_id : id})
    // res.send({success : true, message : "data delete successfully", data : data})

    try {
    const id = parseInt(req.params.id);
    await pool.query("DELETE FROM users where id = $1", [id]);
    res.json(`Person ${id} was deleted from the contact`);
  } catch (err) {
    res.json(err);
  }
})

// const URL="mongodb+srv://user:pass123@crudoperation.3kp8e01.mongodb.net/?retryWrites=true&w=majority"

// mongoose.connect(URL,{useNewUrlParser:true})
// .then(()=>{
//     console.log("connect to DB")
app.listen(PORT,()=>console.log("Server is running"))
// })
// .catch((err)=>console.log(err))

