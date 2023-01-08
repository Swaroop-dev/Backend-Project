const express=require('express')
const route=express.Router()
const {addProduct,getAllProduct,updateProductById}=require('../controllers/productController')
const { isLoggedIn,customRoleChecker } = require('../middlewares/user')

//admin route
route.route('/product/add').post(isLoggedIn,customRoleChecker("Admin"),addProduct)
route.route('/product/add').post(isLoggedIn,customRoleChecker("Admin"),updateProductById)

//doesnt require admin previliges
route.route('/products').post(getAllProduct)
route.route('/product/:id').get()

module.exports=route