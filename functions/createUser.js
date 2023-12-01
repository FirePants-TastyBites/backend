import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { sendResponse } from "../responses/sendResponse";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function createUser(event) {
    const { email, password, isAdmin } = JSON.parse(event.body);

    try {
        const command = new PutCommand({
            TableName: 'userTable',
            Item: {
                email: email,
                password: password,
                isAdmin: isAdmin
            }
        });

        await docClient.send(command);

        return sendResponse(201, { success: true });
    } catch (err) {
        return sendResponse(err.statusCode, { success: false, message: err.message });
    }
}