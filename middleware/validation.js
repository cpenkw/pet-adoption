const Joi = require('joi');

// Validation middleware
exports.validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors
            });
        }

        next();
    };
};

// Register validation schema
exports.registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('client', 'admin').default('client'),
    phone: Joi.string().allow('').optional(),
    address: Joi.string().allow('').optional()
});

// Login validation schema
exports.loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// Pet validation schema
exports.petSchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid('Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Other').required(),
    breed: Joi.string().required(),
    age: Joi.number().min(0).required(),
    gender: Joi.string().valid('Male', 'Female').required(),
    description: Joi.string().max(500).required(),
    color: Joi.string().default('Mixed'),
    size: Joi.string().valid('Small', 'Medium', 'Large').default('Medium'),
    vaccinated: Joi.boolean().default(false),
    status: Joi.string().valid('Available', 'Adopted', 'Pending').default('Available'),
    image: Joi.string().uri().optional(),
    contactEmail: Joi.string().email().required(),
    contactPhone: Joi.string().allow('').optional()
});