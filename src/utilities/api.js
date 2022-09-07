import axios from "axios";

// api.themoviedb.org is a database of movie information
export default {
    getMovies: function(pageNum) {
        return axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=${pageNum}`);
    }
};