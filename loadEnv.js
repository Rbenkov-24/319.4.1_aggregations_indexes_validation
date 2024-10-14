import dotenv from 'dotenv'; //kanjibu library smitha dotenv li kat3awnna bach nloadiw l-variables dyal l'environnement.

dotenv.config(); //hna kan7tajo dotenv bach nloadiw l-variables li kaynin f l-file .env

console.log(process.env.PORT); //kanjibu l-variable PORT li kayn f l-environment w n3rdo f console
console.log(process.env.MONGODB_URI); //kanjibu l-variable MONGODB_URI li kayn f l-environment w n3rdo f console