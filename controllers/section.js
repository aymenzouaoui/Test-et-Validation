import Section from '../models/section.js';
import Category from '../models/category.js'; // Import the Category model

export async function deleteSectionById(req, res) {
  try {
    const section = await Section.findById(req.params.id).lean(); // Use lean() to get a plain JavaScript object
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Find the category that contains the section to be deleted
    const category = await Category.findOne({ 'sections.section': req.params.id });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Remove the section from the category's sections array
    category.sections = category.sections.filter(sec => sec.section.toString() !== req.params.id);
    await category.save();

    // Now remove the section from the Section collection
    await Section.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Section deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
