// Import required libraries
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Import the Dish model so we can insert sample dishes
const Dish = require("./models/Dish"); // Import Dish model

// Load environment variables from .env file
dotenv.config();

const app = express();

// Enable Cross-Origin Resource Sharing (optional but good practice)
app.use(cors());

// Allow Express to parse incoming JSON data
app.use(express.json());

// Serve static files (HTML, CSS, JS) from the 'public' folder
app.use(express.static("public"));

// Import and use routes for dishes
const dishRoutes = require("./routes/dishes");
app.use("/api/dishes", dishRoutes);

// MongoDB Sample Data Insertion Function
const insertSampleDishes = async () => {
    const sampleDishes = [
      {
        name: "Spaghetti Carbonara",
        ingredients: ["Spaghetti", "Eggs", "Pancetta", "Parmesan", "Black pepper"],
        preparationSteps: [
          "Cook spaghetti in salted water.",
          "Fry pancetta until crispy.",
          "Whisk eggs and parmesan, then combine with pasta and pancetta.",
          "Serve with extra cheese and pepper."
        ],
        cookingTime: 30,
        origin: "Italy",
        spiceLevel: "Mild"
      },
      {
        name: "Chicken Tikka Masala",
        ingredients: ["Chicken", "Yogurt", "Spices", "Tomatoes", "Onions"],
        preparationSteps: [
          "Marinate chicken in yogurt and spices.",
          "Cook onions and tomatoes to make the sauce.",
          "Cook chicken in the sauce and serve with rice."
        ],
        cookingTime: 45,
        origin: "India",
        spiceLevel: "Spicy"
      },
      {
        name: "Sushi",
        ingredients: ["Rice", "Fish", "Seaweed", "Vinegar", "Soy Sauce"],
        preparationSteps: [
          "Prepare rice and season with vinegar.",
          "Slice fish and roll with rice and seaweed.",
          "Serve with soy sauce."
        ],
        cookingTime: 20,
        origin: "Japan",
        spiceLevel: "Mild"
      },
      {
        name: "Tacos",
        ingredients: ["Taco Shells", "Beef", "Cheese", "Lettuce", "Salsa"],
        preparationSteps: [
          "Cook beef and season with spices.",
          "Fill taco shells with beef, cheese, lettuce, and salsa.",
          "Serve with lime wedges."
        ],
        cookingTime: 25,
        origin: "Mexico",
        spiceLevel: "Medium"
      },
      {
        name: "Chicken Alfredo",
        ingredients: ["Chicken", "Pasta", "Cream", "Garlic", "Parmesan"],
        preparationSteps: [
          "Cook pasta and set aside.",
          "Cook chicken in garlic and butter.",
          "Combine chicken, pasta, and cream to make the sauce.",
          "Serve with extra parmesan."
        ],
        cookingTime: 35,
        origin: "Italy",
        spiceLevel: "Mild"
      }
    ];
  
    try {
      // Insert the sample dishes into MongoDB
      for (const dish of sampleDishes) {
        // Check if the dish already exists
        const existingDish = await Dish.findOne({ name: dish.name });
        if (!existingDish) {
          // Only insert the dish if it doesn't already exist
          await Dish.create(dish);
          console.log(` ${dish.name} inserted into the database!`);
        } else {
          console.log(` ${dish.name} already exists in the database!`);
        }
      }
    } catch (error) {
      console.error("Error inserting sample dishes:", error);
    }
};

// Function to delete duplicate dishes based on name
const deleteDuplicates = async () => {
  try {
    // Find all dishes with duplicate names
    const dishes = await Dish.aggregate([
      { $group: { _id: "$name", count: { $sum: 1 }, ids: { $push: "$_id" } } },
      { $match: { count: { $gt: 1 } } }, // Only select groups with more than one dish
    ]);

    // For each group of duplicate dishes, remove the extra ones
    for (const dishGroup of dishes) {
      // Keep the first dish and remove the rest
      const [firstDishId, ...duplicateIds] = dishGroup.ids;
      await Dish.deleteMany({ _id: { $in: duplicateIds } }); // Delete the duplicates
      console.log(` Duplicates of "${dishGroup._id}" deleted. Kept one.`);
    }

  } catch (error) {
    console.error(" Error deleting duplicates:", error);
  }
};

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.CONNECTION_URL)
  .then(() => {
    // Insert sample dishes once DB connection is successful
    insertSampleDishes();

    // Call the delete duplicates function to clean up the dishes
    deleteDuplicates();

    // Start the server once the DB is connected
    app.listen(process.env.PORT, () => {
      console.log(` Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
