import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { sendResponse } from "../responses/sendResponse";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function getOrdersByUserId(event) {
    const { userId } = JSON.parse(event.body);

    try {
        const command = new QueryCommand({
            TableName: 'orderTable',
            IndexName: "userId-gsi",
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId,
            },
        });

        const response = await docClient.send(command);

        return sendResponse(200, { success: true, orders: response.Items });

    } catch(err) {
        return sendResponse(err.statusCode, { success: false, message: err.message });
    }
}