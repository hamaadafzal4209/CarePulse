import { users } from "../appwrite.config";
import { ID, Query } from "node-appwrite";

export const createUser = async (user: CreateUserParams) => {
  try {
    const normalizedEmail = user.email.trim().toLowerCase(); // Normalize email

    // Try to create a new user
    const newUser = await users.create(
      ID.unique(),
      normalizedEmail,
      user.phone,
      undefined, // Handle password if required by your Appwrite setup
      user.name
    );
    
    console.log("New User created: ", newUser);
    return newUser; // Return the created user object

  } catch (error: any) {
    // Check if the error code is 409, indicating a user already exists
    if (error?.code === 409) {
      console.log("User already exists, retrieving the user...");

      // Query the existing user by email
      const existingUser = await users.list([
        Query.equal("email", [user.email.trim().toLowerCase()]), // Use normalized email
      ]);

      console.log("Existing User query result:", existingUser);

      if (existingUser.total > 0 && existingUser.users.length > 0) {
        const foundUser = existingUser.users[0]; // Extract the first user from the list
        console.log("Existing User found: ", foundUser);
        return foundUser; // Return the existing user
      } else {
        throw new Error("User not found, despite conflict error.");
      }
    }

    console.error("An error occurred while creating a new user:", error);
    throw error; // Re-throw the error for further handling
  }
};
