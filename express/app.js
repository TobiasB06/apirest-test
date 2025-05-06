const express = require('express');
const movies = require('./movies.json');
const crypto = require('crypto');  
const app = express();
const validateMovie = require('./movie.js');
const cors = require('cors');

const port = process.env.PORT ?? 3000;


app.use(express.json());
app.use(cors({
    origin: "http://127.0.0.1:3001/",
}));
app.use(cors({
    origin: "*",
}));
app.get("/", (req, res) => {
    res.json({
        message: "hola mundo",
        status: 200,
    });
  });

app.get("/movies", (req, res) => {
    const {genre} = req.query;
    if (genre) {
        const filteredMovies = movies.filter(
            (movie) => movie.genre.includes(genre)
        );
        return res.json(filteredMovies);
    }

    res.json(movies);
});

app.get("/movies/:id", (req, res) => {
    const { id } = req.params;
    const movie = movies.find((movie) => movie.id === id);
    if (movie) {
        return res.json(movie);
    }
    res.status(404).json({
        message: "Movie not found",
        status: 404,
    });
});

app.post("/movies", (req, res) => {
    const resultado = validateMovie.validateMovie(req.body);
    if (!resultado.valid) {
        return res.status(400).json({
          message: "Invalid movie data",
          status: 400,
          error: resultado.error.format(),
        });
      }
     
     const newMovie = {
        id: crypto.randomUUID(),
        ... resultado.data
     };

        movies.push(newMovie);

        res.status(201).json({
        message: "Movie created",
        status: 201,
        movie: newMovie,
         })
});


app.patch("/movies/:id", (req, res) => {
    const { id } = req.params;
    const resultado = validateMovie.validatePartialMovie(req.body);

    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) {
        return res.status(404).json({
            message: "Movie not found",
            status: 404,
        });
    }

    const updatedMovie = {
        ...movies[movieIndex],
        ...resultado.data,
    };

    movies[movieIndex] = updatedMovie;
    res.json({
        message: "Movie updated",
        status: 200,
        movie: updatedMovie,
    });
});
 

const server = app.listen(port,"0.0.0.0", () => {
    console.log(`Server is running on port http://localhost:${port}`);
})