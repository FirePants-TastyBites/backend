import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { sendResponse } from "../responses/sendResponse";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function updateOrder(event) {
    const { id, orderStatus, deliveryTime } = JSON.parse(event.body);

    let isLocked = false;
    if (orderStatus === 'handled') {
        isLocked = true;
    } else if (orderStatus === 'cancelled') {
        isLocked = false;
    }

    try {
        const command = new UpdateCommand({
            TableName: 'orderTable',
            Key: {
                id: id
            },
            UpdateExpression: "set orderStatus = :orderStatus, deliveryTime = :deliveryTime, isLocked = :isLocked",
            ExpressionAttributeValues: {
                ":orderStatus": orderStatus,
                ":deliveryTime": deliveryTime,
                ":isLocked": isLocked
            },
            ReturnValues: "ALL_NEW"
        });

        await docClient.send(command);
        
        return sendResponse(200, { success: true });

    } catch(err) {
        return sendResponse(err.statusCode, { success: false, message: err.message });
    }
}