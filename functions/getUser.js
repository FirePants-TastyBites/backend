import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { sendResponse } from "../responses/sendResponse";
import { decrypt } from "./decrypt";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function getUser(event) {
    const { email, password } = JSON.parse(event.body);

    try {
        const command = new ScanCommand({
            TableName: 'usersTable'
        });
            
        const response = await docClient.send(command);

        let allUsers = response.Items;
        let userWithDecryptedEmail = allUsers.find(user => decrypt(user.email) === email);        
        let decryptedPassword = decrypt(userWithDecryptedEmail.password);
     
        if (password === decryptedPassword) {
            return sendResponse(200, { success: true, email: decrypt(userWithDecryptedEmail.email), isAdmin: userWithDecryptedEmail.isAdmin });
        } else {
            return sendResponse(400, { success: false, message: 'Wrong password' });
        }
    
    } catch (err) {
        return sendResponse(err.statusCode, { success: false, message: err.message });
    }
}