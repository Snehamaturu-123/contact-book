const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Contact = require('../models/Contact');

const router = express.Router();

/**
 * GET /api/contacts?page=1&limit=10
 * Returns paginated contacts and total count
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1 }).toInt()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const skip = (page - 1) * limit;

      const [contacts, total] = await Promise.all([
        Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        Contact.countDocuments()
      ]);

      res.json({ contacts, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * POST /api/contacts
 * Body: { name, email, phone }
 */
router.post('/', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        if (!name || !email || !phone) return res.status(400).json({ message: 'All fields required' });
        const contact = new Contact({ name, email, phone });
        await contact.save();
        res.status(201).json(contact);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * DELETE /api/contacts/:id
 */
router.delete(
  '/:id',
  [ param('id').isMongoId().withMessage('Invalid contact id') ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const deleted = await Contact.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Contact not found' });

      res.json({ message: 'Contact deleted', id: req.params.id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
