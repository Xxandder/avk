import express from 'express';
import { deleteProductById, getAllData, updateProduct, addProduct, getProductById } from './db/db.js';
import cors from 'cors';
import  multer from 'multer';
import fs from 'fs';
import { generateRandomFileName } from './helpers/generate-random-file-name.helper.js';

const app = express();
const port = 443;

app.use(cors());
app.use(express.json());
app.use(express.static('./public'))
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.get('/', (req, res) => {
  getAllData().then((products)=>{
    res.send(products)
  })
  
});

app.post('/', upload.single('image'), (req, res) => {
  const dataToCreate = req.body;

  let filename;
  if(req.file){
    filename = generateRandomFileName() + '_' + req.file.originalname
    const savePath = './public/images/' + filename;
    fs.writeFile(savePath, req.file.buffer, (err) => {
  });
  }

  try{
    addProduct({...dataToCreate,
      imagePath: filename,
      weights: dataToCreate.weights.split(',').map(Number)}).then(()=>{
      res.send({
        message: "Successfully added product"
      });
    })
  
  }catch(e){
    throw new Error(e);
  }
  
})

app.put('/:id', upload.single('image'), async (req, res) => {
  const id = req.params.id;
  const dataToUpdate = req.body;

  //удаление текущего изображения
  if(req.file){
    const currentProduct = await getProductById(id);
    fs.unlink('./public/images/' + currentProduct.imagePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log('Файл не существует');
        } else {
          console.error('Ошибка при удалении файла:', err);
        }
      } else {
        console.log('Файл успешно удален.');
      }
    });
  }
 

  //save file
  let filename;
  if(req.file){
    filename = generateRandomFileName() + '_' + req.file.originalname
    const savePath = './public/images/' + filename;
    fs.writeFile(savePath, req.file.buffer, (err) => {
  });
  }
  try{
    updateProduct(id, {...dataToUpdate,
       imagePath: filename,
       weights:dataToUpdate.weights.split(',').map(Number)}
       )
       .then(()=>{
        res.send({
          message: "Successfully updated product"
        });
    })
   
  }catch(e){
    throw new Error(e);
  }
})



app.delete('/:id', async(req, res) => {
  const id = req.params.id;
  const currentProduct = await getProductById(id);
    fs.unlink('./public/images/' + currentProduct.imagePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log('Файл не существует');
        } else {
          console.error('Ошибка при удалении файла:', err);
        }
      } else {
        console.log('Файл успешно удален.');
      }
    });
  
  try{
    deleteProductById(id).then(()=>{
      res.send({
        message: "Successfully deleted product"
      });
    })
   
  }catch(e){
    throw new Error(e);
  }
  
})


app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});