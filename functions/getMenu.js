import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function getMenu(event) {
    try {
        const command = new ScanCommand({
            TableName: 'menuTable',
        });

        const response = await docClient.send(command);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, menu: response.Items })
        }

    } catch(err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'Could not get menu' })
        }
    }
}