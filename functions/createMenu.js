import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { nanoid } from "nanoid";
import { sendResponse } from "../responses/sendResponse";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function createMenu(event) {
    const { title, price, ingredients, nutritions, category, url, isAvailable } = JSON.parse(event.body);
    
    try {
        const id = nanoid();

        const command = new PutCommand({
            TableName: 'menuTable',
            Item: {
                id: id,
                title: title,
                price: price,
                ingredients: ingredients,
                nutritions: nutritions,
                category: category,
                url: url,
                isAvailable: isAvailable
            }
        });
        await docClient.send(command);
        return sendResponse(201, { success: true });
    } catch(err) {
        return sendResponse(err.statusCode, { success: false, message: err.message });
    }
}