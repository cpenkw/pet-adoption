const express = require('express');
const router = express.Router();
const {
    createPet,
    getAllPets,
    getPetById,
    updatePet,
    deletePet
} = require('../controllers/petController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Upload image
router.post('/upload', protect, adminOnly, upload.single('petImage'), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ success: true, message: 'Image uploaded successfully', imageUrl });
});

// CRUD
router.post('/', protect, adminOnly, upload.single('petImage'), createPet);
router.get('/', getAllPets);
router.get('/:id', getPetById);
router.put('/:id', protect, adminOnly, upload.single('petImage'), updatePet);
router.delete('/:id', protect, adminOnly, deletePet);

module.exports = router;

