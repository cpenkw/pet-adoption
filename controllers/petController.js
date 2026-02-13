const Pet = require('../models/Pet');

// Create new pet
exports.createPet = async (req, res, next) => {
    try {
        // Формируем полный URL для изображения
        let imageUrl = req.body.image || 'https://via.placeholder.com/300x300?text=Pet+Image';
        if (req.file) {
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const petData = {
            ...req.body,
            image: imageUrl,
            addedBy: req.user.id
        };

        const pet = await Pet.create(petData);

        res.status(201).json({
            success: true,
            message: 'Pet added successfully',
            data: pet
        });
    } catch (error) {
        next(error);
    }
};

// Get all pets
exports.getAllPets = async (req, res, next) => {
    try {
        const { type, breed, status } = req.query;
        let filter = {};

        if (type && type !== 'all') filter.type = type;
        if (breed && breed !== 'all') filter.breed = new RegExp(breed, 'i');
        if (status) filter.status = status;

        const pets = await Pet.find(filter).populate('addedBy', 'username email').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: pets.length,
            data: pets
        });
    } catch (error) {
        next(error);
    }
};

// Get pet by ID
exports.getPetById = async (req, res, next) => {
    try {
        const pet = await Pet.findById(req.params.id).populate('addedBy', 'username email');
        if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });

        res.status(200).json({ success: true, data: pet });
    } catch (error) {
        next(error);
    }
};

// Update pet
exports.updatePet = async (req, res, next) => {
    try {
        let pet = await Pet.findById(req.params.id);
        if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });

        if (req.file) {
            req.body.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        res.status(200).json({ success: true, message: 'Pet updated successfully', data: pet });
    } catch (error) {
        next(error);
    }
};

// Delete pet
exports.deletePet = async (req, res, next) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });

        await pet.deleteOne();
        res.status(200).json({ success: true, message: 'Pet deleted successfully' });
    } catch (error) {
        next(error);
    }
};

