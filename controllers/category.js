const Category = require("../models/category");

exports.addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ error: "Category name is required" });
    }
    const existingCategory = await Category.findOne({
      categoryName: { $regex: new RegExp(categoryName, "i") },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: "Category with this name already exists",
      });
    }
    const newCategory = new Category({ categoryName });
    const savedCategory = await newCategory.save();

    return res.status(201).json(savedCategory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Category added failed" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    // await Category.deleteMany();
    const categories = await Category.find();
    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Faile to get categories" });
  }
};
exports.editCategory = async (req, res) => {
  try {
    const { categoryId, newCategoryName } = req.body;

    if (!categoryId || !newCategoryName) {
      return res
        .status(400)
        .json({ error: "Category ID and new name are required" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { categoryName: newCategoryName },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update category" });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({ error: "Category ID is required" });
    }

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete category" });
  }
};
