import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { sendResponse } from "../responses/sendResponse";
import { encrypt } from "./encrypt";
import { nanoid } from "nanoid";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function createUser(event) {
    const { email, password, isAdmin } = JSON.parse(event.body);

    const id = nanoid();

    try {
        const command = new PutCommand({
            TableName: 'usersTable',
            Item: {
                id: id,
                email: encrypt(email),
                password: encrypt(password),
                isAdmin: isAdmin
            }
        });

        await docClient.send(command);

        return sendResponse(201, { success: true });
    } catch (err) {
        return sendResponse(err.statusCode, { success: false, message: err.message });
    }
}