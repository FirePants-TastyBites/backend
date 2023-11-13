import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { nanoid } from "nanoid";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function createMenu(event) {
    const { itemName, price, description, category } = JSON.parse(event.body);
    
    try {
        const id = nanoid();

        const command = new PutCommand({
            TableName: 'menuTable',
            Item: {
                id: id,
                itemName: itemName,
                price: price,
                description: description,
                category: category
            }
        });
        await docClient.send(command);
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ success: true })
        }
    } catch(err) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ success: false, message: 'Could not post menu item' })
        }
    }
}