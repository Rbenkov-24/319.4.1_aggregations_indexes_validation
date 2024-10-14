import express from 'express'; //kanjibu framework li ghadi nistakhdmo
import gradesRouter from './routes/grades.js'; 
import './loadEnv.js'; //kanjibu loadEnv.js bash nloadiw l'environnement variables

//hna kan7tajo variable smiytou app li kaymthl l-Express application dyalna
const app = express(); 
//nakhdo PORT mn les variables d'environnement
const PORT = process.env.PORT; 


/*middleware f Express huwa code li kaydour ben l-client (browser) w l-server (application). Kiyt3amlo 3la l-request w l-response. f Express middleware kaykhdmo l-3ibara 3la functions li kay7tajo l-server f l-ma3loumat li ja min l-client.*/
//kanhkmo middleware li kaykhdmo JSON parsing
app.use(express.json()); 
//kanjibu gradesRouter f '/api/grades' path
app.use('/api/grades', gradesRouter); 

//kanjibu route li kayrje3 'ok' f root URL
app.get('/', (req, res) => res.send('ok')); 

//kanjibu lserver ybda khdem f PORT li 3tina
app.listen(PORT, () => console.log(`server running on port: ${PORT}`)); 