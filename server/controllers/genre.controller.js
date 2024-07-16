const db = require('../models');
const Genre = db.genre;

const getGenre = async (req, res) => {
    const genreId = req.params.id;

    Genre.findById(genreId, (err, genre) => {
        if (err) {
            return res.status(400).json({ success: false, err });
        }

        return res.status(200).json({
            success: true,
            genre
        });
    });
}

const getAllGenres = async (req, res) => {
    // const genre = {}
    Genre.find({}, (err, genres)=>{
        if (err) {
            return res.status(400).json({ success: false, err });
        }

        return res.status(200).json({
            success: true,
            genresList: genres
        });
    })
}

const addGenre = async (req, res) => {
    const newGenre = req.body
    console.log(req.session)
    console.log(req.isAuthenticated())
    Genre.create(newGenre, (err, genre) => {
        if (err) {
            return res.status(400).json({ success: false, err });
        }

        return res.status(200).json({
            success: true,
            newGenre: genre
        });
    })
}

const updateGenre = async (req, res) => {
    const genreId = req.params.id
    const updatedGenre = req.body

    Genre.findByIdAndUpdate(genreId,updatedGenre, (err, genre) => {
        if (err) {
            return res.status(400).json({ success: false, err });
        }

        return res.status(200).json({
            success: true,
            updatedGenre: genre
        });
    })
}

const deleteGenre = async (req, res) => {
    const genreId = req.params.id

    Genre.findByIdAndDelete(genreId, (err, genre) => {
        if (err) {
            return res.status(400).json({ success: false, err });
        }

        return res.status(200).json({
            success: true,
            deletedGenre: genre
        });
    })
}
const genreController ={
    getGenre,
    getAllGenres,
    addGenre,
    updateGenre,
    deleteGenre
}
module.exports = genreController;