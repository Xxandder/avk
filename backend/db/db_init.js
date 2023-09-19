import sqlite3 from 'sqlite3';

const dbFilePath = './backend/db/db.sqlite'; // Путь к файлу базы данных SQLite

const createDatabase = () => {
  const db = new sqlite3.Database(dbFilePath);

  db.serialize(() => {
    // Создаем таблицу products с полями title, text, price, weights и img
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        text TEXT,
        price REAL,
        weights TEXT,
        imagePath TEXT
      )
    `);

    // Вставляем данные из объекта
    const product = {
      title: "Равликипо-Бургундськи",
      text: "М’ясо заправлене французьким соусом „Де Бургонь“, приготованим з найкращого вершкового масла з використанням французьких прянощів, часнику, цибулі, петрушки чорного перцю та білого сухого Вина.",
      price: 1050,
      weights: JSON.stringify([1000, 150]),
      imagePath: "product.jpg"
    };

    const stmt = db.prepare("INSERT INTO products (title, text, price, weights, imagePath) VALUES (?, ?, ?, ?, ?)");
    stmt.run(
      product.title,
      product.text,
      product.price,
      product.weights,
      product.imagePath
    );
    

   
    stmt.run(
      product.title,
      product.text,
      product.price,
      product.weights,
      product.imagePath
    );
    stmt.finalize();

    console.log('Таблица и данные успешно созданы.');
  });

};

createDatabase();
