import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { sendResponse } from "../responses/sendResponse";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function createOrder(event) {
  const { id, userId, totalPrice, deliveryTime, cart, comment } = JSON.parse(event.body);

  try {
    const createdAt = new Date();

    const command = new PutCommand({
      TableName: "orderTable",
      Item: {
        id: id,
        userId: userId, //Use email for now
        totalPrice: totalPrice,
        createdAt: createdAt.toISOString(),
        deliveryTime: deliveryTime,
        isLocked: false, 
        cart: cart,
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
