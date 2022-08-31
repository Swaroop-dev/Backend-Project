//new dev branch for development purpose
const express=require('express')
const {port}=require('./Config/config')
const {connect} =require('./Config/database')


const swaggerUi=require('swagger-ui-express');
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yml')


const app=express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/users',(req, res) => {
    res.status(200).json({user:"swaroop"})
})

connect()

app.listen(port, ()=>{
    console.log(`server running at port ${port}`);
})