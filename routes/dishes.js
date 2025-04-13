const express = require("express");
const router = express.Router();
const Dish = require("../models/Dish");

// GET /api/dishes - Fetch all dishes from the database
router.get("/", async (req, res) => {
  try {
    const dishes = await Dish.find(); // Fetch all dishes
    res.json(dishes);                 // Send them as JSON response
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle error
  }
});

// GET /api/dishes/id/:id - Fetch a dish by its ID
router.get("/id/:id", async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (dish) {
      res.json(dish);
    } else {
      res.status(404).json({ message: "Dish not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET /api/dishes/:name - Fetch a dish by its name
router.get("/:name", async (req, res) => {
  try {
    const dish = await Dish.findOne({ name: req.params.name }); // Find dish by name
    if (dish) {
      res.json(dish); // Send dish data as JSON
    } else {
      res.status(404).json({ message: "Dish not found" }); // If not found, return 404
    }
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle error
  }
});

// POST /api/dishes - Add a new dish
router.post("/", async (req, res) => {
  const { name, ingredients, preparationSteps, cookingTime, origin, spiceLevel } = req.body;

  try {
    const existingDish = await Dish.findOne({ name });
    if (existingDish) {
      return res.status(409).json({ message: "Dish already exists" }); // Conflict error if dish exists
    }

    const newDish = new Dish({
      name,
      ingredients,
      preparationSteps,
      cookingTime,
      origin,
      spiceLevel,
    });

    const savedDish = await newDish.save();
    res.status(201).json(savedDish); // Return 201 with saved dish data
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle bad data error
  }
});

// PUT /api/dishes/:id - Update an existing dish
router.put("/:id", async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id); // Find dish by ID
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" }); // If dish doesn't exist, return 404
    }

    // Update the dish with new values from the request body
    dish.name = req.body.name || dish.name;
    dish.ingredients = req.body.ingredients || dish.ingredients;
    dish.preparationSteps = req.body.preparationSteps || dish.preparationSteps;
    dish.cookingTime = req.body.cookingTime || dish.cookingTime;
    dish.origin = req.body.origin || dish.origin;
    dish.spiceLevel = req.body.spiceLevel || dish.spiceLevel;

    const updatedDish = await dish.save(); // Save the updated dish
    res.json(updatedDish); // Return the updated dish
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle bad data error
  }
});

// DELETE /api/dishes/:id - Delete a dish by its ID
router.delete("/:id", async (req, res) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id); // Find and delete the dish by ID
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" }); // Return 404 if dish not found
    }
    res.json({ message: "Dish deleted successfully" }); // Return success message
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle error
  }
});

module.exports = router; // Export the router to be used in server.js
