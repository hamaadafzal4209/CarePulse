/* eslint-disable @typescript-eslint/no-explicit-any */
import { databases, storage, users } from "../appwrite.config";
import { ID, Query, InputFile } from "node-appwrite";
import { parseStringify } from "../utils";

// Directly assign the variables
const PROJECT_ID = "66e371830030780800d0";
const API_KEY =
  "standard_a86434ebb7d29947a108ffe82287f3f481e4f5962318a0c79c6091fa4dfe9670ba87a5ca71d93a7baf000cb09e8a91685294da49b0b6c3bbfae259481237d912baa6b20bc5ea4bd3816ace29f4719fd3b2b8e570d4c08ce5615c6965cbaabcb5e491a469f9d3de9d023a93d6017a389ed051e178175424585f06ff204e975368";
const DATABASE_ID = "66e3725f003c347a7a34";
const PATIENT_COLLECTION_ID = "66e37294000956bb2a5c";
const DOCTOR_COLLECTION_ID = "66e372ca000946f0b5de";
const APPOINTMENT_COLLECTION_ID = "66e372fd0025d0561cfc";
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
    // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
    let file;
    if (identificationDocument) {
      const inputFile =
        identificationDocument &&
        InputFile.fromBlob(
          identificationDocument?.get("blobFile") as Blob,
          identificationDocument?.get("fileName") as string
        );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
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
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
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
