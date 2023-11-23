import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { sendResponse } from "../responses/sendResponse";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function getMenu(event) {
    try {
        const command = new ScanCommand({
            TableName: 'menuTable',
        });

        const response = await docClient.send(command);

        return sendResponse(200, { success: true, menu: response.Items }); 

    } catch(err) {
        return sendResponse(err.statusCode, { success: false, message: err.message });
    }
}