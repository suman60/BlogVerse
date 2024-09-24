const express = require('express');
const router = express.Router();

const Post = require('../models/Post');




//routes 

// GET Home
router.get('', async (req, res) => {

    try {

        const locals = {
            title: "Blog Verse",
            description: "Simple User interfaces"
        }
        let perPage = 10;
        let page = req.query.page || 1;


        const data = await Post.aggregate([{ $sort: { createAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();
        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null
        });

    } catch (error) {
        console.log(error);
    }

});
// router.get('', async(req, res)=>{
//     const locals={
//         title:"Blog Verse", 
//         description:"Simple User interfaces"
//     }
//     try {
//         const data = await Post.find(); 
//         res.render('index',{ locals, data }); 

//     } catch (error) {
//         console.log(error) ; 
//     }

// });

// GET post:id 

router.get('/post/:id', async (req, res) => {

    try {

        let slug = req.params.id;

        const data = await Post.findById({ _id: slug });
        const locals = {
            title: data.title,
            description: "Simple User interfaces"
        }
        res.render('post', { locals, data });

    } catch (error) {
        console.log(error);
    }

});
//post searchTerm 
router.post('/search', async (req, res) => {

    try {
        const locals = {
            title: "Blog Verse",
            description: "Simple User interfaces"
        }
        let searchTerm = req.body.searchTerm;
        const searchNoSpetialChar= searchTerm.replace(/[^a-zA-z0-9]/g, ""); 
        const data= await Post.find({
            $or:[
                {title:{$regex:new RegExp(searchNoSpetialChar, 'i')}}, 
                {body:{$regex:new RegExp(searchNoSpetialChar, 'i')}}
            ]
        }); 
        res.render('search',{
            data, 
            locals
        });

    } catch (error) {
        console.log(error);
    }

});

// function insertPostData(){
//     Post.insertMany([
//         {
//             title:"Building a Blog", 
//             body:"This is the body text"
//         }, 
//         {
//             title:"Asyncronous Programming with Node.js", 
//             body:"Asyncronous Programming with Node.js:Explore the asyncronous nature of Node.js"
//         }
//     ])
// }
// insertPostData(); 










router.get('/about', (req, res) => {
    res.render('about');
})
router.get('/contact', (req, res) => {
    res.render('contact');
})
module.exports = router; 