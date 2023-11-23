import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { sendResponse } from "../responses/sendResponse";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function getOrders() {
    try {
        const command = new ScanCommand({
            TableName: 'orderTable'
        });

        const response = await docClient.send(command);

        return sendResponse(200, { success: true, orders: response.Items });
    } catch(err) {
        return sendResponse(err.statusCode, { success: false, message: err.message });
    }
}