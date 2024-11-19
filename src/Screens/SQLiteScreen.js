import * as SQLite from "expo-sqlite";
// const db = SQLite.openDatabaseSync('./newchatapp.db');

// //Initialize SQLite and Create Messages Table
// export const createTables = () => {
//     db.transaction(tx => {
//         tx.executeSql(
//             `CREATE TABLE IF NOT EXISTS messages (
//                 _id TEXT PRIMARY KEY,
//                 content TEXT,
//                 username TEXT,
//                 createdAt TEXT,
//                 isFailed INTEGER
//      );`
//         );
//     });
// };

// //Insert newMessage into the Database

// export const addMessageToDatabase = (message) => {
//     db.transaction(tx => {
//         tx.executeSql(
//             `INSERT INTO messages (_id, content, username, createdAt, isFailed)
//          VALUES (?, ?, ?, ?, ?);`,
//             [
//                 message._id,
//                 message.content,
//                 message.username,
//                 message.createdAt,
//                 message.isFailed ? 1 : 0  // Store boolean as integer
//             ],
//             (tx, result) => {
//                 console.log("Message added to SQLite:", result);
//             },
//             (tx, error) => {
//                 console.error("Error adding message to SQLite:", error);
//             }
//         );
//     });
// };

// //Fetching Messages
// export const getMessagesFromDatabase = (callback) => {
//     db.transaction(tx => {
//         tx.executeSql(
//             `SELECT * FROM messages ORDER BY createdAt DESC;`,
//             [],
//             (tx, { rows }) => {
//                 const messages = rows._array;
//                 callback(messages);
//                 console.log("Messages retrieved from SQLite:", messages); // Log retrieved messages
//             },
//             (tx, error) => {
//                 console.error("Error fetching messages:", error);
//             }
//         );
//     });
// };

//store and retrieve chat messages

// const testDatabase = () => {
//     try {
//         const db = SQLite.openDatabaseAsync('newchatapp.db');
//         console.log('Database initialized successfully:', db);
//     } catch (error) {
//         console.error('Error initializing SQLite database:', error);
//     }
// };
// let db;
// const initDatabase = async () => {
//     try {
//         db = await SQLite.openDatabaseAsync('newchatapp.db'); // Use the provided async method
//         console.log('Database initialized successfully:', db);
//     } catch (error) {
//         console.error('Error initializing SQLite database:', error);
//     }
// };

// // Function to fetch all messages
// export const getAllMessages = async () => {
//     try {
//         await initDatabase();
//         if (!db) {
//             throw new Error('Database not initialized. Call initDatabase() first.');
//         }
//         return new Promise((resolve, reject) => {
//             db.transaction((tx) => {
//                 tx.executeSql(
//                     `SELECT * FROM messages ORDER BY createdAt DESC;`,
//                     [],
//                     (tx, result) => {
//                         const messages = result.rows._array; // Extract rows
//                         console.log('Messages retrieved:', messages);
//                         resolve(messages); // Resolve with messages
//                     },
//                     (tx, error) => {
//                         console.error('Error executing SQL:', error);
//                         reject(error); // Reject on SQL error
//                     }
//                 );
//             });
//         });
//     } catch (error) {
//         console.error('Error fetching messages:', error);
//         throw error; // Rethrow error for higher-level handling
//     }
// };

// getAllMessages();
// let db;
// const initializeDb = async () => {
//   const db = await SQLite.openDatabaseAsync("newchatapp.db");

//     console.log(db);
//   // `execAsync()` is useful for bulk queries when you want to execute altogether.
//   // Please note that `execAsync()` does not escape parameters and may lead to SQL injection.
//   await db.execAsync(`
//     PRAGMA journal_mode = WAL;
//     CREATE TABLE IF NOT EXISTS messages (_id TEXT PRIMARY KEY NOT NULL, content TEXT, username TEXT, createdAt TEXT, isFailed INTEGER, roomid TEXT);
//     INSERT INTO messages (_id, content, username, createdAt, isFailed, roomid) VALUES ("1", "new messages", "ali", "11/18/2024", 0, "abcd123");
//     INSERT INTO messages (_id, content, username, createdAt, isFailed, roomid) VALUES ("2", "new messages 2", "ali", "11/18/2024", 0, "abcd123");
//     INSERT INTO messages (_id, content, username, createdAt, isFailed, roomid) VALUES ("3", "new messages 3", "ali", "11/18/2024", 0, "abcd123");
//     `);

//   //   // `runAsync()` is useful when you want to execute some write operations.

//   //   // `getAllAsync()` is useful when you want to get all results as an array of objects.
//     const allRows = await db.getAllAsync("SELECT * FROM messages");
//     for (const row of allRows) {
//       console.log(row._id, row.content);
//     }

//     // `getEachAsync()` is useful when you want to iterate SQLite query cursor.
//     // for await (const row of db.getEachAsync("SELECT * FROM messages")) {
//     //   console.log(row.id, row.value, row.intValue);
//     // }
// };

// const getAllMessages = async () => {
//   initializeDb();
//   console.log("Starting...");
//   setTimeout(() => {
//     console.log("Waited for 2 seconds!");
//   }, 2000);
//   const allRows =  db.getAllAsync("SELECT * FROM messages");
//   for (const row of allRows) {
//     console.log(row._id, row.content);
//   }
// };

// initializeDb();
// getAllMessages();

let db;
const initializeDB = async () => {
  db = await SQLite.openDatabaseAsync("newchatapp.db");
  console.log(db);

//   addBulkDataInDB();
};

const addBulkDataInDB = async () => {
  // `execAsync()` is useful for bulk queries when you want to execute altogether.
  // Please note that `execAsync()` does not escape parameters and may lead to SQL injection.
  try {
    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS messages (_id TEXT PRIMARY KEY NOT NULL, content TEXT, username TEXT, createdAt TEXT, isFailed INTEGER, roomid TEXT);
    `);

    // fetchDataFromDb();
  } catch (error) {
    console.error("Error during DB operation:", error);
  }
};

export const addDataToDb = async (data) => {
    try {
      // Ensure the database is initialized before proceeding
      await initializeDB();
  
      // SQL query to insert data into the messages table
      const query = `
        INSERT INTO messages (_id, content, username, createdAt, isFailed, roomid) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
  
      // Destructure the fields from the input data object
      const { _id, content, username, createdAt, isFailed, roomid } = data;
  
      // Execute the query with parameterized values
      await db.runAsync(query, [_id, content, username, createdAt, isFailed, roomid]);
  
      console.log(`Data successfully added: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error("Error adding data to DB:", error);
      throw error; // Re-throw the error to let the caller handle it
    }
  };
  

export const fetchDataFromDb = async (roomid) => {
    await initializeDB();
  // `getAllAsync()` is useful when you want to get all results as an array of objects.
  try {
    const allRows = await db.getAllAsync(`SELECT * FROM messages WHERE roomid = ?`,
  [roomid]);
    for (const row of allRows) {
      console.log(row._id, row.content);
    }
    return allRows;
  } catch (error) {
    console.error("Error fetching data from DB:", error);
  }
};

// initializeDB();
