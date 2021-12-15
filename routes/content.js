var express = require('express')
var router = express.Router()
const checkUser = require('../middleware/checkUser')
const { 
        getAllAricles, 
        addNewPost, 
        getPosts, 
        getNews, 
        getPost, 
        getUserPosts, 
        getUserBookmark,
        checkSavedPost,
        contentLike,
        getContentLikes,
        getUserLikes,
        savePost,
      } = require('../controller/ariclesController')

router.post('/add-posts', checkUser, addNewPost)

router.get('/all-posts', getPosts)

router.get('/all-news', getNews)

router.get('/all-articles', getAllAricles)

router.get('/get-post/:id', getPost)

router.get('/user-posts', getUserPosts)

router.get('/user-bookmark', getUserBookmark)

router.post('/save-post', checkUser, savePost)

router.post('/check-saved-posts', checkSavedPost)

router.patch('/content-like', contentLike)

router.get('/get-content-likes-count', getContentLikes)

router.get('/get_user_likes', getUserLikes)

module.exports = router
