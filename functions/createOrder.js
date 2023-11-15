import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { nanoid } from "nanoid";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function createOrder(event) {
  const { userId, totalAmount, orderItems, comment } = JSON.parse(event.body);

  try {
    const id = nanoid();
    const orderTime = new Date();
    const deliveryTime = new Date(new Date().getTime() + 20 * 60000); //= 20 min

    //Denna funktion i frontend ist som uppdaterar isLocked till true i updateOrder
    function isLocked() {
      let currentTime = new Date();
      let fiveMinutesLater = new Date(orderTime.getTime() + 5 * 60 * 1000); //= 5 min

      if (currentTime >= fiveMinutesLater) {
        return true;
      } else {
        return false;
      }
    }

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

    console.log("LOGGING COMMAND ---> ", command);

    await docClient.send(command);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: false,
        message: "Could not create order",
      }),
    };
  }
}
