
import express from 'express';

//swagger related imports
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./swagger.yml')


const app=express();
const PORT=4000;



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/users',(req, res) => {
    res.status(200).json({user:"swaroop"})
})


app.listen(PORT, ()=>{
    console.log(`server running at port ${PORT}`);
})