import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { sendResponse } from "../responses/sendResponse";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function updateMenu(event) {
    const { id, isAvailable } = JSON.parse(event.body);

    try {
        const command = new UpdateCommand({
            TableName: 'menuTable',
            Key: {
                id: id
            },
            UpdateExpression: "set isAvailable = :isAvailable",
            ExpressionAttributeValues: {
                ":isAvailable": isAvailable
            },
            ReturnValues: "ALL_NEW"
        });

        await docClient.send(command);

        return sendResponse(200, { success: true });

    } catch (err) {
        return sendResponse(err.statusCode, { success: false, message: err.message });
    }
}