import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";


const app=express()
app.use(express.json())
dotenv.config();
//server running on port//
const PORT=process.env.PORT;

const MONGO_URL=process.env.MONGO_URL;

//mongodb connection// 
async function connection(){
    const client=new MongoClient(MONGO_URL)
    await client.connect()
    console.log(" Mongodb connected")
    return client;
}
//client global variable//
const client=await connection();

//welcome page//
app.get("/",(request,response)=>{
    response.send("welcome to Hotel Elite")
})

let rooms=[]
let bookingrecord=[]

//post method to create room//
app.post("/create_room",async(request,response)=>{
    let room={}
    if(request.body.no_of_seats) 
    room.no_of_seats=request.body.no_of_seats;
    else{
        response.status(400).send({message:"Enter the number of seats"})
    }
    if(request.body.amenties) 
    room.amenties=request.body.amenties;
    else{
        response.status(400).send({message:"Enter the amenties"})
    }
    if(request.body.price)
    room.price=request.body.price
    else{
    response.status(400).send({message:"Enter the price per hour"})
}

    rooms.push(room);
    await client.db("bwd28").collection("rooms").insertOne(room)
    room ?
    response.status(200).send({message:"Room created"}) :
    response.status(400).send({message:"Required details"})
    console.log(room);
})

app.post("/booking",(request,response)=>{
    let booking={}
    if(request.body.roomid){
    booking.roomid=request.body.roomid
    }else{
        response.status(400).send({message:"RoomId Required"})
    }
    if(request.body.Date){
    booking.Date=request.body.Date
    }else{
      response.status(400).send({message:"Date Required"})
    }
    if(request.body.starttime){
        booking.starttime=request.body.starttime
    }else{
        response.status(400).send({message:"Starttime Required"})
    }
    if(request.body.endtime){
        booking.endtime=request.body.endtime
    }else{
        response.status(400).send({message:"Endtime Required"})
    }
    if(request.body.customer_name){
        booking.customer_name=request.body.customer_name
    }else{
    response.status(400).send({message:"CustomerName Required"})
    }
   //push booking into bookingrecord
    bookingrecord.push(booking);
    client.db("bwd28").collection("booking").insertOne(booking);
    bookingrecord ?
    response.status(200).send({message:"Room Booked"}):
    response.status(400).send({message:"Details Required"})
    console.log(bookingrecord);
})
//booking customer detail using get method
app.get("/booked_customer",async(request,response)=>{
    const booked=await client.db("bwd28").collection("booking").find({}).toArray();
    booked?
    response.status(200).send(booked):
    response.status(400).send({message:"Server down"})
})
//booking room details using get method//
app.get("/book_room",async(request,response)=>{
    const room= await client.db("bwd28").collection("rooms").find({}).toArray();
    room?
    response.status(200).send(room):
    response.status(400).send({message:"Server down"})
})

app.listen(PORT,()=>console.log("App is running in",PORT))