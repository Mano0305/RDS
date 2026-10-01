import json
import boto3

# Create a DynamoDB object using the AWS SDK with proper region
dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
# Use the DynamoDB object to select our table
table = dynamodb.Table('StudentData')

# Define the handler function that the Lambda service will use as an entry point
def lambda_handler(event, context):
    # Extract values from the event object we got from the Lambda service and store in variables
    student_id = event['student_id']
    name = event['name']
    student_class = event['class']
    age = event['age']
    
    # Write student data to the DynamoDB table and save the response in a variable
    response = table.put_item(
        Item={
            'student_id': student_id,
            'name': name,
            'class': student_class,
            'age': age
        }
    )
    
    # Return a properly formatted JSON object with CORS headers
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
        },
        'body': json.dumps({'message': 'Student data saved successfully!'})
    }