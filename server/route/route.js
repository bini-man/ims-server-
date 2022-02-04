const route= require('express').Router()
const Incident=require('../model/Incident')
const User = require('../model/User')
const bcrypt = require('bcrypt')
const { Router } = require('express')
// for createing incident
route.post("/incident_creat", async (req,res)=>{
    try {
        const incident = new Incident({
            incident_name:req.body.name,
            incident_description:req.body.description,
            incident_owner:req.body.owner,
            incident_created_by:req.body.created_by,
            incident_status:req.body.status
        })
        const saved_incident=await incident.save()
        res.send(saved_incident)
    } catch (error) {
        res.send(error)
    }
})
// for creating user
route.post("/user_creat", async (req,res)=>{
    const email_check=await User.findOne({email:req.body.email})
    if(email_check) return res.send("email alredy exists")
    const salt= await bcrypt.genSalt(10)
    const hashPassword= await bcrypt.hash(req.body.password,salt)
    try {
        const user = new User({
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            email:req.body.email,
            role:req.body.role,
            password:hashPassword,
            // status:"Active"
        })
        const saved_user=await user.save()
        res.send(saved_user)
    } catch (error) {
        res.send(error)
    }
})
// to see all incident
route.get('/all_user',(req,res)=>{
   
    User.find({},(function(err,result){
        if(err) return res.send(err)
        res.json(result)
    })
    )
})
// to see all user
route.get('/all_incident',(req,res)=>{
    Incident.find({},(function(err,result){
        if(err) return res.send(err)
        res.json(result)
    })
    )
})
// to return specific user
route.get('/user/:id',(req,res)=>{
    const user_id= req.params.id;
    User.findById({_id:user_id},(function(err,result){
        if(err) return res.send(err)
        res.json(result)
    }))
})
// to return specific incident
route.get('/incident/:id',(req,res)=>{
    const incident_id= req.params.id;
    Incident.findById({_id:incident_id},(function(err,result){
        if(err) return res.send(err)
        res.json(result)
    }))
})
// to Delete specific user
route.post('/user/:id',(req,res)=>{
    const user_id= req.params.id;
    User.findByIdAndDelete({_id:user_id},(function(err,result){
        if(err) return res.send(err)
        res.json("user successfuly deleted")
    }))
})
// to Delete specific incident
route.post('/incident/:id',(req,res)=>{
    const incident_id= req.params.id;
    Incident.findByIdAndDelete({_id:incident_id},(function(err,result){
        if(err) return res.send(err)
        res.json("incident successfuly deleted")
    }))
})
// to update specific user information
route.post('/update_user/:id',async (req,res)=>{
    const user_id= req.params.id;
    const salt= await bcrypt.genSalt(10)
    const hashPassword= await bcrypt.hash(req.body.password,salt)
    User.findByIdAndUpdate({_id:user_id},{
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            email:req.body.email,
            role:req.body.role,
            password:hashPassword
    },(function(err,result){
        if(err) return res.send(err)
        res.json("user information successfuly updated")
    }))
})
// to update specific incident information
route.post('/update_incident/:id',(req,res)=>{
    const incident_id= req.params.id;
    Incident.findByIdAndUpdate({_id:incident_id},{
        incident_name:req.body.name,
        incident_description:req.body.description,
        incident_owner:req.body.owner,
        incident_created_by:req.body.created_by,
        incident_status:req.body.status
    },(function(err,result){
        if(err) return res.send(err)
        res.json("incident information successfuly updated")
    }))
})
module.exports=route;