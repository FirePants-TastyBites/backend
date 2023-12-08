import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { sendResponse } from "../responses/sendResponse";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function getOrderById(event) {
    const { id } = event.pathParameters;

    try {
        const command = new GetCommand({
            TableName: 'orderTable',
            Key: {
                id: id
            }
        });
            
        const response = await docClient.send(command);

        return sendResponse(200, { success: true, order: response.Item });
    
    } catch (err) {
        return sendResponse(err.statusCode, { success: false, message: err.message });
    }
}