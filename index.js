// 1. Use require instead of import
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;


// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Cargar preguntas desde JSON. En esta variable dispones siempre de todasl as preguntas de la "base de datos"
const questions = JSON.parse(fs.readFileSync('./questions.json', 'utf-8'));

// Creo una funció que generi un índex aleatori d'un array i el retorni
function randomQuestion(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};
// console.log(questions)
console.log(randomQuestion(questions));

let categories = questions.map((q) => q.category);

categories = [...new Set(categories)];
console.log(categories);



// Endpoint para obtener una pregunta aleatoria (con filtro por categoría)
app.get('/api/question', (req, res) => {
  let category = req.query.category;
  if (!category){
      return res.json(randomQuestion(questions));
  };
  const filteredQuestions = questions.filter(q => q.category && q.category.toLowerCase() === category.toLowerCase());
  if (filteredQuestions.length === 0) {
    return res.status(404).json({error: 'Error 404: no hay preguntas para la categoría solicitada'})
  } 

  res.json((randomQuestion(filteredQuestions)))

});

// Endpoint para obtener categorías únicas
app.get('/api/categories', (req, res) => {
  res.json(categories);
});



// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Trivia escuchando en http://localhost:${PORT}`);
});
