import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { nanoid } from "nanoid";
import { sendResponse } from "../responses/sendResponse";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function createOrder(event) {
  const { userId, totalAmount, deliveryTime, orderItems, comment } = JSON.parse(event.body);

  try {
    const id = nanoid();
    const createdAt = new Date();

    const command = new PutCommand({
      TableName: "orderTable",
      Item: {
        id: id, //Skickas från frontend
        userId: userId, //Use email for now
        totalAmount: totalAmount,
        createdAt: createdAt.toISOString(),
        deliveryTime: deliveryTime,
        isLocked: false, 
        orderItems: orderItems,
        comment: comment,
        orderStatus: 'pending', 
      },
    });

    await docClient.send(command);

    return sendResponse(201, { success: true });
  } catch (err) {
        return sendResponse(err.statusCode, { success: false, message: err.message });
  }
}
