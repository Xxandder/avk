import sqlite3 from 'sqlite3';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbFilePath = __dirname + '/db.sqlite';  // Путь к файлу базы данных SQLite

function getAllData() {
  return new Promise((resolve, reject) => {
    console.log(dbFilePath);
      const db = new sqlite3.Database(dbFilePath);
      db.all('SELECT * FROM products', (err, rows) => {
        if (err) {
          throw err;
        }
        db.close();
        resolve(rows);
      })
    })
  }

  function getProductById(id) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbFilePath);
      const query = 'SELECT * FROM products WHERE id = ?';
      
      db.get(query, [id], (err, row) => {
        if (err) {
          db.close();
          reject(err);
        } else {
          db.close();
          resolve(row);
        }
      });
    });
  }

  function updateProduct(id, dataToUpdate){
     
      return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbFilePath);


        const updateQuery = "UPDATE products SET " +
        (dataToUpdate.title ? 'title = ?,' : '') +
        (dataToUpdate.text ? 'text = ?,' : '') +
        (dataToUpdate.price ? 'price = ?,' : '') +
        (dataToUpdate.weights ? 'weights = ?': '') +
        (dataToUpdate.imagePath ? ',imagePath = ?': '') + 
        ' WHERE id = ?';
        
        const queryParams = [
          dataToUpdate.title || null,
          dataToUpdate.text || null,
          dataToUpdate.price || null,
          JSON.stringify(dataToUpdate.weights) || null,
          id
        ];
        if(dataToUpdate.imagePath){
          const lastIndex = queryParams.length - 1;
          queryParams.splice(lastIndex, 0, dataToUpdate.imagePath)
        }
        console.log('imagePath: ', dataToUpdate.imagePath)
        console.log('params: ', queryParams);
        console.log('query: ', updateQuery)

        db.run(updateQuery, queryParams, function (err) {
          db.close();
          
          if (err) {
            reject(err);
          } else {
            resolve(this.changes);
          }
        });
      }) 
  }

  function deleteProductById(productId) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbFilePath);
  
      const deleteQuery = 'DELETE FROM products WHERE id = ?';
  
      db.run(deleteQuery, [productId], function (err) {
        db.close();
  
        if (err) {
          reject(err);
        } else {
          resolve(`Элемент с ID ${productId} был успешно удален`);
        }
      });
    });
  }

  function addProduct(dataToCreate){
      
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbFilePath);


      const insertQuery = "INSERT INTO products (title, text, price, weights, imagePath) VALUES (?, ?, ?, ?, ?)";

      const queryParams = [
        dataToCreate.title || null,
        dataToCreate.text || null,
        dataToCreate.price || null,
        JSON.stringify(dataToCreate.weights) || null,
        dataToCreate.imagePath || null
      ];

      db.run(insertQuery, queryParams, function (err) {
        db.close();
  
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    }) 
}
  


export { getAllData, updateProduct, deleteProductById, addProduct, getProductById };


