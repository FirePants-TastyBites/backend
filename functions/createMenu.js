import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { nanoid } from "nanoid";
import { sendResponse } from "../responses/sendResponse";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function createMenu(event) {
    const { itemName, price, ingredients, description, category, url } = JSON.parse(event.body);
    
    try {
        const id = nanoid();

        const command = new PutCommand({
            TableName: 'menuTable',
            Item: {
                id: id,
                itemName: itemName,
                price: price,
                ingredients: ingredients,
                description: description,
                category: category,
                url: url
            }
        });
        await docClient.send(command);
        return sendResponse(201, { success: true });
    } catch(err) {
        return sendResponse(err.statusCode, { success: false, message: err.message });
    }
}