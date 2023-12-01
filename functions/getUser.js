import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { sendResponse } from "../responses/sendResponse";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function getUser(event) {
    const { email, password } = JSON.parse(event.body);

    try {
        const command = new GetCommand({
            TableName: 'userTable',
            Key: {
                email: email
            }
        });
            
        const response = await docClient.send(command);
     
        if (password === response.Item.password) {
            return sendResponse(200, { success: true, email: response.Item.email, isAdmin: response.Item.isAdmin });
        } else {
            return sendResponse(400, { success: false, message: 'Wrong password' });
        }
    
    } catch (err) {
        return sendResponse(err.statusCode, { success: false, message: err.message });
    }
}