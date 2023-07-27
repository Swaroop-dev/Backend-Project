const express=require('express')
const route=express.Router()
const {addProduct,getAllProduct,updateProductById,getAllProductById,deleteProductbyId,addReviewForProductyId,getReviewForProductById}=require('../controllers/productController')
const { isLoggedIn,customRoleChecker } = require('../middlewares/user')

//admin route
route.route('/product/add').post(isLoggedIn,customRoleChecker("Admin"),addProduct)

route.route('/product/:id').post(isLoggedIn,customRoleChecker("Admin"),updateProductById)
                           .get(getAllProductById)
                           .delete(isLoggedIn,customRoleChecker("Admin"),deleteProductbyId)

//doesnt require admin previliges
route.route('/products').get(getAllProduct);

//review routes
route.route('/product/:id/review').post(isLoggedIn,addReviewForProductyId)
                                  .get(isLoggedIn,getReviewForProductById)



module.exports=route