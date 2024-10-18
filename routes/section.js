import express from 'express';
import Section from '../models/section.js';
import { deleteSectionById } from '../controllers/section.js';


const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const sections = await Section.find();
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const section = new Section({
    title: req.body.title,
    descriptionF: req.body.descriptionF,
    descriptionK: req.body.descriptionK,
    descriptionS: req.body.descriptionS,
    colorLine: req.body.colorLine,
    codeBox: req.body.codeBox,
    formatOptions: req.body.formatOptions


  });

  try {
    const newSection = await section.save();
    res.status(201).json(newSection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id', getSection, (req, res) => {
  res.json(res.section);
});

router.patch('/:id', getSection, async (req, res) => {
  if (req.body.title != null) {
    res.section.title = req.body.title;
  }
  if (req.body.descriptionF != null) {
    res.section.descriptionF = req.body.descriptionF;
  }
  if (req.body.descriptionK != null) {
    res.section.descriptionK = req.body.descriptionK;
  }
  if (req.body.descriptionS != null) {
    res.section.descriptionS = req.body.descriptionS;
  }

  
  try {
    const updatedSection = await res.section.save();
    res.json(updatedSection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", deleteSectionById);


async function getSection(req, res, next) {
  try {
    const section = await Section.findById(req.params.id);
    if (section == null) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.section = section;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export default router;
