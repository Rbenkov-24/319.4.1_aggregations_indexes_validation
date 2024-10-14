import { MongoClient } from "mongodb"; //kanjib MongoClient mn l-library dyal mongodb
import "../loadEnv.js";

//hna katkhli l-link li ghadi tconnecta b MongoDB mn l-environment variable
const connectionString = process.env.MONGODB_URI || ""; 

//mongodb client instance.kansayab wa7d l-instance dyal MongoClient b l-connection string
const client = new MongoClient(connectionString);

//connection
let conn; 
try {
  conn = await client.connect(); //kan7awlo nconnecto l-database

  const db = conn.db("sample_training"); //kanchofo l-database li ghadi nsta3mlo "sample_training"

  // ===== Creating Indexes =====

  const gradesCollection = db.collection("grades"); //n7drou 3la l-collection dyal "grades"
  await gradesCollection.createIndex({ class_id: 1 }); 
  await gradesCollection.createIndex({ learner_id: 1 }); //kanj3lo index 3la l-field learner_id
  await gradesCollection.createIndex({ learner_id: 1, class_id: 1 });

  // ===== Applying validation rules =====

  await db.command({
    collMod: "grades", //kan7awlo ndir modifi l-collection "grades"
    validator: {
      $jsonSchema: { //kanst3mlo l-json schema bach ndir validation
        bsonType: "object", //naw3 dyal l-object li ghadi nkhdmo bih
        required: ["class_id", "learner_id"], //l-fields li khasshom ykono mwjoudin
        properties: { 
          class_id: {
            bsonType: "int", //naw3 dyal class_id hiya integer (bla fasila)
            minimum: 0, 
            maximum: 300, 
          },
          learner_id: {
            bsonType: "int", 
            minimum: 0,
          },
        },
      },
    },
    validationAction: "warn",
  });

  console.log("Database connected, indexes and validation rules applied"); 
} catch (e) {
  console.error("Error connecting to MongoDB", e); 
}

// kanexportiw l-database "sample_training"
export default conn.db("sample_training"); 