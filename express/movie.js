const z = require('zod');

const movieSchema = z.object({
        title: z.string().min(1, { message: "Title is required" }),
        //genre: 
        year: z.number().min(1900).max(2025),
        director: z.string().min(1, { message: "Director is required" }),
        duration: z.number().min(1, { message: "Duration is required" }),
        rate: z.number().min(1).max(10, { message: "Rate must be between 1 and 10" }),
        poster: z.string().url().optional(),
        genre: z.array(z.string()).nonempty({ message: "Genre is required" }),
     });
function validateMovie(movie) {
    const result = movieSchema.safeParse(movie);
    if (result.success) {
      return { valid: true, data: result.data };
    } else {
      return { valid: false, error: result.error };
    }
  }
function validatePartialMovie(movie){
    return movieSchema.partial().safeParse(movie);
}



module.exports = {
    validateMovie,
    validatePartialMovie,
    movieSchema,
};