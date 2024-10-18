import Category from '../models/category.js';


export function deleteCategoryById(req, res) {
    Category.findByIdAndDelete(req.params.id)
      .then((category) => {
        if (!category) {
          res.status(404).json({ message: 'Category not found' });
        } else {
          res.status(200).json({ message: 'Category deleted successfully' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  }
  