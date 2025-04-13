const mongoose = require("mongoose");

// Define schema (structure) for Dish documents
const dishSchema = new mongoose.Schema({
  name: String,                // Name of the dish
  ingredients: [String],       // List of ingredients
  preparationSteps: [String],  // Step-by-step instructions
  cookingTime: Number,         // Total cooking time in minutes
  origin: String,              // Country or cultural origin
  spiceLevel: String           //  Custom field: spice level
});

// Export the model so we can use it in routes
module.exports = mongoose.model("Dish", dishSchema);
