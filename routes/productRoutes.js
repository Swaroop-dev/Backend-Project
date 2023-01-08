const express=require('express')
const route=express.Router()
const {addProduct,getAllProduct,updateProductById,getAllProductById,deleteProductbyId}=require('../controllers/productController')
const { isLoggedIn,customRoleChecker } = require('../middlewares/user')

//admin route
route.route('/product/add').post(isLoggedIn,customRoleChecker("Admin"),addProduct)

route.route('/product/:id').post(isLoggedIn,customRoleChecker("Admin"),updateProductById)
                           .get(getAllProductById)
                           .delete(isLoggedIn,customRoleChecker("Admin"),deleteProductbyId)

//doesnt require admin previliges
route.route('/products').post(getAllProduct)
route.route('/product/:id').get(getAllProductById)




module.exports=route