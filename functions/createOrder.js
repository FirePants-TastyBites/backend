import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { nanoid } from "nanoid";
import { sendResponse } from "../responses/sendResponse";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function createOrder(event) {
  const { userId, totalAmount, orderItems, comment } = JSON.parse(event.body);

  try {
    const id = nanoid();
    const orderTime = new Date();
    const deliveryTime = new Date(new Date().getTime() + 20 * 60000); //= 20 min

    const command = new PutCommand({
      TableName: "orderTable",
      Item: {
        id: id,
        userId: userId, //Use email for now
        totalAmount: totalAmount,
        orderTime: orderTime.toISOString(),
        deliveryTime: deliveryTime.toISOString(),
        isLocked: false, 
        orderItems: orderItems,
        comment: comment,
      },
    });

    await docClient.send(command);

    return sendResponse(201, { success: true });
  } catch (err) {
    return sendResponse(500, { success: false, message: 'Could not create order' });
  }
}
