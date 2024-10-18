import express from 'express';
import Category from '../models/category.js'; // Assuming this is the file containing the Category model
import Section from '../models/section.js';
import { deleteCategoryById } from '../controllers/category.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().populate({
      path: 'sections.section',
      select: 'title'
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const category = new Category({
    name: req.body.name,
    sections: req.body.sections
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id', getCategory, (req, res) => {
  res.json(res.category);
});

router.patch('/:id', getCategory, async (req, res) => {
  if (req.body.name != null) {
    res.category.name = req.body.name;
  }
  if (req.body.sections != null) {
    res.category.sections = req.body.sections;
  }

  try {
    const updatedCategory = await res.category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", deleteCategoryById);

async function getCategory(req, res, next) {
  try {
    const category = await Category.findById(req.params.id);
    if (category == null) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.category = category;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
// POST endpoint to add a new section to a category
router.post('/:categoryId/sections', async (req, res) => {
  const { categoryId } = req.params;
  const { title, descriptionF, descriptionK, descriptionS } = req.body;

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const newSection = new Section({
      title,
      descriptionF,
      descriptionK,
      descriptionS
    });

    await newSection.save();

    // Add the new section to the category without deleting other sections
    category.sections.push({ section: newSection._id, title, descriptionF, descriptionK, descriptionS });
    await category.save();

    res.status(201).json({ message: 'Section added to category successfully', section: newSection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// PATCH update a specific section within a category by ID
router.patch('/:categoryId/sections/:sectionId', async (req, res) => {
  // Extract data from the request body
  const { categoryId, sectionId } = req.params;
  const { title, descriptionF, descriptionK, descriptionS } = req.body;

  try {
    // Find the category by ID
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find the section within the category by ID
    const sectionIndex = category.sections.findIndex(section => section.section.toString() === sectionId);

    if (sectionIndex === -1) {
      return res.status(404).json({ message: 'Section not found within the category' });
    }

    // Update the section's details in the category
    category.sections[sectionIndex].title = title;
    category.sections[sectionIndex].descriptionF = descriptionF;
    category.sections[sectionIndex].descriptionK = descriptionK;
    category.sections[sectionIndex].descriptionS = descriptionS;

    // Save the updated category
    await category.save();

    // Update the section data in the section collection
    const section = await Section.findByIdAndUpdate(sectionId, {
      title,
      descriptionF,
      descriptionK,
      descriptionS
    }, { new: true });

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Respond with success message
    res.status(200).json({ message: 'Section updated successfully' });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
});

export default router;
