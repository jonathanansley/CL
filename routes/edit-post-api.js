const express = require('express');
const validator = require('validator');


// Requiring our models
let db = require("../models")

let router = express.Router()

router.get("/:postId/:userId", (req,res) =>{


  const usersPostObj = {
    id:req.params.postId,
    userId:req.params.userId
  }

  // Check if userId and postId combo match.
  validateUsersPost(usersPostObj, (validPost) => {

    if (validPost) {

      const postValuesObj = {
        title: validPost.name,
        body: validPost.postbody,
        categoryId: validPost.categoryId,
        price: validPost.price,
        obo: validPost.obo,
        zip: validPost.zip,
        id: validPost.id,
        author: validPost.userId
      }

      if (validPost.location){
        postValuesObj.city = validPost.location;
      }
      if (validPost.phone){
        postValuesObj.phone = validPost.phone;
      }

      res.json(postValuesObj)

    } else {

      res.json(false)

    }

  })
})


router.post("/" , (req,res)=>{

  const p = req.body;

  const errors = [];

  if(validator.isEmpty(p.postTitle)){errors.push({error: "Title is a required field"})}

  if(validator.isEmpty(p.postBody)){errors.push({error: "Post Body is a required field"})}

  if(validator.isEmpty(p.postCategory)){errors.push({error: "Category is a required field"})}

  if(validator.isEmpty(p.postPrice)){errors.push({error: "Price is a required field"})}
  else if(!validator.isFloat(p.postPrice)){errors.push({error: "Invalid Price. Must be a valid number. No need to include commas."})}

  if(validator.isEmpty(p.postZip)){errors.push({error: "Zip Code is a required field"})}

  if(!validator.isPostalCode(p.postZip, "US")){errors.push({error: "Invalid Zip Code"})}

  if (p.postPhone){
    if(!validator.isNumeric(p.postPhone)){errors.push({error: "Invalid Phone Number"})}
    else if(!validator.isLength(p.postPhone, {min:10, max:10})){errors.push({error: "Invalid Phone Number"})}
  }


  const errorObj = {errors}

  if (errors.length > 0){

    // Return Validation Errors
    res.json(errorObj)

  } else {

    //Post to DB
    const Post = function(name,zip,postbody,price,obo,userId,categoryId,postId){
      this.name = name;
      this.zip = zip;
      this.postbody = postbody;
      this.price = price.replace(',', '');
      this.obo = obo;
      this.userId = userId;
      this.categoryId = categoryId;
      this.id = postId;
    }

    const editedPost = new Post(p.postTitle, p.postZip, p.postBody, p.postPrice, p.postObo, p.userId , p.postCategory, p.postId);

    if(p.postPhone){editedPost.phone = p.postPhone}

    let addressString = "";

    if(p.postStreetAddress){addressString += " " + p.postStreetAddress};
    if(p.postCity){
      addressString += " " + p.postCity;
      editedPost.location = p.postCity;
    };
    if(p.postState){addressString += " " + p.postState};

    if(addressString){editedPost.address = addressString.trim()}

    updatePost(editedPost, (data)=>{

      if(data){
        res.json("success")
      }

    })

  }



})


module.exports = router;

// Helper Functions
// -------------------------------------------------------------


function validateUsersPost(obj, callback){

  db.post.findOne({
    where: obj
  }).then((post)=>{

    if(post != null){
      callback(post)
    } else {
      callback(false)
    }

  })
}

function updatePost(postObj, callback){

  db.post.update(postObj, {where:{id:postObj.id}})
  .then((data)=>{
    callback(data)
  }).catch(function (err) {
    console.log(err)
    callback("error")
  });


}
