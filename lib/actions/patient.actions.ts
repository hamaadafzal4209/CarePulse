import { databases, storage, users } from "../appwrite.config";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import * as fs from "fs";
import * as path from "path";

// Directly assign the variables
const DATABASE_ID = "66e3725f003c347a7a34";
const PATIENT_COLLECTION_ID = "66e37294000956bb2a5c";
const BUCKET_ID = "66e3734b00069588d0a7";
const ENDPOINT = "https://cloud.appwrite.io/v1";

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    const normalizedEmail = user.email.trim().toLowerCase(); // Normalize email

    // Try to create a new user
    const newUser = await users.create(
      ID.unique(),
      normalizedEmail,
      user.phone,
      undefined,
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
        Query.equal("email", [user.email.trim().toLowerCase()]),
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

// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;
    if (identificationDocument && identificationDocument.length > 0) {
      const fileBlob = identificationDocument[0]; // Assuming it's a FileList
      
      if (fileBlob instanceof Blob) {
        const buffer = Buffer.from(await fileBlob.arrayBuffer());

        // Upload file
        file = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          fileBlob.name,
          buffer,
          {
            contentType: fileBlob.type,
          }
        );
      } else {
        throw new Error("The provided fileBlob is not a valid Blob.");
      }
    } else {
      console.warn("No identification document provided.");
    }

    // Create new patient document
    const newPatient = await databases.createDocument(
      DATABASE_ID,
      PATIENT_COLLECTION_ID,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ?? null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
          : null,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};

// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID,
      PATIENT_COLLECTION_ID,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};