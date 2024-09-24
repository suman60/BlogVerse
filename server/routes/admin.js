const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const amdinLayout = '../views/layouts/admin';

//check login 
const authMiddleWare = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}



//GET 
// Admin - login page 
router.get('/admin', async (req, res) => {

    try {
        const locals = {
            title: "Admin",
            description: "Simple Blog created with Nodejs , express & mongodb "
        }
        res.render('admin/index', { locals, layout: amdinLayout });

    } catch (error) {
        console.log(error);
    }
})

//Post 
// Admin check login

router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'invalid credentials' })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'invalid credentials' })
        }
        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
    }
})

//get admin dashbord 
router.get('/dashboard', authMiddleWare, async (req, res) => {
    try {
        const locals = {
            title: 'Dashbord',
            description: 'Simple Blog created with Nodejs Express & MongoDB.'
        }
        const data = await Post.find();
        res.render('admin/dashboard', {
            locals,
            data,
            layout: amdinLayout
        });
    } catch (error) {

    }

})
// GET Admin create new page 

router.get('/add-post', authMiddleWare, async (req, res) => {
    try {
        const locals = {
            title: 'Dashbord',
            description: 'Simple Blog created with Nodejs Express & MongoDB.'
        }
        const data = await Post.find();
        res.render('admin/add-post', {
            locals,
            layout: amdinLayout
        });
    } catch (error) {

    }

})
// Post Admin create new page 

router.post('/add-post', authMiddleWare, async (req, res) => {
    try {
        console.log(req.body);
        try {
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body
            });
            await Post.create(newPost);
            res.redirect('/dashboard');
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }

})
// router.post('/admin', async (req, res) => {
//     try {
//         const {username , password}= req.body; 
//         if(req.body.username=='admin' && req.body.password=='suman'){
//             res.send("you are logged in "); 
//         }else {
//             res.send("Wrong username or password"); 
//         }
//     } catch (error) {
//         console.log(error);
//     }
// })

//get admin create new post
router.get('/edit-post/:id', authMiddleWare, async (req, res) => {
    try {
        const postId = req.params.id.trim();

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).send('Invalid Post ID');
        }

        const locals = {
            title: "Edit Post",
            description: "Free NodeJs User Management System",
        };

        // Fetch the post data
        const data = await Post.findById(postId);

        if (!data) {
            return res.status(404).send('Post not found');
        }

        res.render('admin/edit-post', {
            locals,
            data,
            layout: amdinLayout
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});



//put admin create new post
router.put('/edit-post/:id', authMiddleWare, async (req, res) => {
    try {

        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect(`/edit-post/${req.params.id}`);

    } catch (error) {
        console.log(error);
    }

});

// Delete
router.delete('/delete-post/:id', authMiddleWare, async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.id });
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }

});






//Post 
// Admin register 

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const user = await User.create({ username, password: hashedPassword });
            res.status(201).json({ message: 'user created', user });
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ message: 'User already in use ' });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    } catch (error) {
        console.log(error);
    }
})

// get admin logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    // res.json({ message: "Logout Successful" });
    res.redirect('/'); 
});
module.exports = router; 