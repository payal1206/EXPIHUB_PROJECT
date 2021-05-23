// function admin (req, res, next) {
//     if(req.isAuthenticated() && req.User.firstName === 'admin') {    yeah authenticate function hmko passport provide krrha which tells us
                                                                           // whether a user is logged in or not 
//         return next()
//     }
//     return res.redirect('/admin')
// }

// module.exports = admin



module.exports = function(req, res, next) {
    if(req.isAuthenticated() && req.user.role === 'admin'){
        return next()
    }

     res.redirect('/')
}
