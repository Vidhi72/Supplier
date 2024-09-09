const express=require('express')
const pool=require("./pool.js")
const upload=require('./multer.js')
const router=express.Router()

router.get('/supp_info',function(req,res){

    res.render('form',{message:''})
})


router.post('/submit',upload.single('logo'),function(req,res){
    try{
       console.log("BODY",req.body)
       console.log("FILE",req.file)
       var prd= req.body.product+""
      
      pool.query("insert into suppliers(suppliername, address, state, city, dueamount, advance, advancedate, firmname, product, logo) values(?,?,?,?,?,?,?,?,?,?)",[req.body.suppliername, req.body.address, req.body.stateid, req.body.cityid, req.body.dueamount, req.body.advance, req.body.advancedate, req.body.firmname, prd, req.file.filename],function(error,result){
       if(error)
       {  console.log("Error:",error)
          res.render('form',{message:'There is issue in database. Contact with data Administrator'})
       }
       else
       {
          res.render('form',{message:'Submitted Succesfully'})
       }
    
    
      })
    }
    catch(e)
    {
       res.render('form',{message:'Server Error.Contact with Backend Team,'+e})
    }
    })



    router.get('/fillstate',function(req,res){
        try{
       pool.query("select * from state",function(error,result){
        if(error)
        {
          res.json({data:[],status:false,message:'Database Error'})
        }
        else
        {
           res.json({data:result,status:true,message:'Success'})
        }
        })
        }
     catch(e)
     {
        res.json({data:[],status:false,message:'Server Error'})
     }
     })


     router.get('/fillcity',function(req,res){
        try{
       pool.query("select * from city where stateid=?",[req.query.stateid],function(error,result){
        if(error)
        {
          res.json({data:[],status:false,message:'Database Error'})
        }
        else
        {
           res.json({data:result,status:true,message:'Success'})
        }
        })
        }
     catch(e)
     {
        res.json({data:[],status:false,message:'Server Error'})
     }
     })
     

     router.get('/display',function(req,res){
      try{
     pool.query("select F.*,(select statename from state S where S.stateid=F.state) as statename,(select cityname from city C where C.cityid=F.city) as cityname from suppliers F",function(error,result){
      if(error)
      {
        res.render('DisplayAll',{status:false,data:[]})
      }
      else
      {
         res.render('DisplayAll',{status:true,data: result})
      }
      })
      }
   catch(e)
   {
      res.render('DisplayAll',{status:false,data:[]})
   }
   })



   router.get('/update_data',function(req,res){
      try{
        
         pool.query("select F.*,(select statename from state S where S.stateid=F.state) as statename,(select cityname from city C where C.cityid=F.city) as cityname from suppliers F where F.supplierid=?",[req.query.supplierid],function(error,result){
          if(error)
          {
            res.render('update',{status:false,data:[]})
          }
          else
          {
             res.render('update',{status:true,data:result[0]})
          }
          })
          }
       catch(e)
       {
          res.render('update',{status:false,data:[]})
       }
       
       
   })


   router.post('/update_item',function(req,res){
      if(req.body.btn=="Edit")
      {
         var prd= req.body.product+""   
         pool.query("update suppliers set suppliername=?, address=?, state=?, city=?, dueamount=?, advance=?, advancedate=?, firmname=?, product=? where supplierid=?",[req.body.suppliername, req.body.address, req.body.stateid, req.body.cityid, req.body.dueamount, req.body.advance, req.body.advancedate, req.body.firmname, prd,req.body.supplierid],function(error,result){
          if(error)
          {
            console.log(error)
            res.redirect('/info/display')
          }
          else
          {
            res.redirect('/info/display')
          }
          })
          
       
      }
      else
      {
         pool.query("delete from suppliers  where supplierid=?",[req.body.supplierid],function(error,result){
            if(error)
            {
              res.redirect('/info/display')
            }
            else
            {
              res.redirect('/info/display')
            }
            })
      }
       
       
   })
   




module.exports=router