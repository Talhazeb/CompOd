from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
# Import cors to allow cross origin requests
from flask_cors import CORS
import openai
import requests

app = Flask(__name__)

openai.api_key = ('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')

# Allow cross origin requests
CORS(app)

app.config['MONGO_URI'] = 'mongodb://localhost:27017/users_db'

mongo = PyMongo(app)


def openAIQuery(query):
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=query,
        temperature=0.5,
        max_tokens=200,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0)

    if 'choices' in response:
        if len(response['choices']) > 0:
            answer = response['choices'][0]['text']
        else:
            answer = 'Error: No response from AI'
    else:
        answer = 'Error: No response from AI'

    return answer

# Signup endpoint


@app.route('/signup', methods=['POST'])
def signup():
    # Get the request data as a json object
    data = request.get_json()

    # Extract the firstname, lastname, email and password from the request data
    firstname = data['firstname']
    lastname = data['lastname']
    email = data['email']
    password = data['password']

    # Check if the username is already taken
    existing_user = mongo.db.users.find_one({'email': email})

    if existing_user is None:
        # If the username is not taken, insert the new user into the MongoDB collection
        mongo.db.users.insert_one(
            {'firstname': firstname, 'lastname': lastname, 'email': email, 'password': password})
        # Return a success response
        return jsonify({'result': 'success'})
    else:
        # If the username is taken, return an error response
        return jsonify({'result': 'failure'})

# Login endpoint


@app.route('/login', methods=['POST'])
def login():
    # Get the request data as a json object
    data = request.get_json()

    # Extract the email and password from the request data
    email = data['email']
    password = data['password']

    # Find the user document with the matching email and password
    user = mongo.db.users.find_one({'email': email, 'password': password})

    if user is None:
        # If no matching user is found, return an error response
        return jsonify({'result': 'failure'})
    else:

        # If a matching user is found, return a success response
        return jsonify({'result': 'success', 'firstname': user['firstname'], 'lastname': user['lastname'], 'email': user['email']})

# Get profile endpoint


@app.route('/profile', methods=['GET'])
def profile():
    # Get the request data as a json object
    data = request.get_json()

    # Extract the email and password from the request data
    email = data['email']

    # Find the user document with the matching email and password
    user = mongo.db.users.find_one({'email': email})

    if user is None:
        # If no matching user is found, return an error response
        return jsonify({'result': 'failure'})
    else:
        # If a matching user is found, return a success response
        return jsonify({'firstname': user['firstname'], 'lastname': user['lastname'], 'email': user['email']})

# Update profile endpoint


@app.route('/profile', methods=['PUT'])
def update_profile():
    # Get the request data as a json object
    data = request.get_json()

    # Extract the firstname, lastname, email and password from the request data
    firstname = data['firstname']
    lastname = data['lastname']
    email = data['email']
    password = data['password']
    # Find the user document with the matching email and password
    user = mongo.db.users.find_one({'email': email})

    if user is None:
        # If no matching user is found, return an error response
        return jsonify({'result': 'failure'})
    else:
        # If a matching user is found, update the user document
        mongo.db.users.update_one({'email': email}, {
                                  '$set': {'firstname': firstname, 'lastname': lastname, 'password': password}})
        # Return a success response
        return jsonify({'result': 'success'})

# Endpoint for openAI


@app.route('/summary', methods=['POST'])
def openAI():
    # Get the request data as a json object
    data = request.get_json()

    query = data['query']

    # Append "Create a summary in bullets format for: " in start of query
    query = "Create a summary in bullets format for: " + query

    try:
        answer = openAIQuery(query)
    except:
        answer = 'Error: No response from AI'

    return jsonify({'answer': answer})

# Endpoint for medicines list


@app.route('/medicines', methods=['POST'])
def medicines():
    # Get query from parameters
    query = request.args.get('query')
    
    urlR = "https://api-gw.medznmore.com/auth/authentication/refresh-token"

    headers = {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json"
    }

    data = {
        "grantType" : "REFRESH_TOKEN",
        "refreshToken" : "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI3ZjMwNDg2Mi0xYTE4LTQ0YTYtODczYy05ZjM0MmJhOTc0OGIifQ.eyJleHAiOjE2ODg3MDk1MTQsImlhdCI6MTY3MzE3MjQ4NywianRpIjoiNjZjODJhOTEtNmE5Yy00M2Q5LWEwODQtYjU0MGRmYWI2MjIxIiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay1hZG1pbi5tZWR6bm1vcmUuY29tL3JlYWxtcy9tZWR6bm1vcmUiLCJhdWQiOiJodHRwczovL2tleWNsb2FrLWFkbWluLm1lZHpubW9yZS5jb20vcmVhbG1zL21lZHpubW9yZSIsInN1YiI6ImMwYjE1NjZkLWRiYTctNDUzMC1hM2ZlLTg4MTQ0NzdmYTkzNSIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJvcmRlci1tYW5hZ2VtZW50LXN5c3RlbSIsInNlc3Npb25fc3RhdGUiOiJiMjUzYWM0ZC0wMzYwLTQyMzQtYTk0MC0wOTYwMzMxNTk1NDMiLCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJzaWQiOiJiMjUzYWM0ZC0wMzYwLTQyMzQtYTk0MC0wOTYwMzMxNTk1NDMifQ.my1Qd0LTZoxA7tOiPiO39pgrbUC4GA4WokaQkq4qoNA",
    }

    response = requests.post(urlR, headers=headers, json=data)
    
    access_token = response.json()['access_token']

    url = "https://api-gw.medznmore.com/b2c/v1/solr/product/search"

    headers = {
        "Accept": "application/json, text/plain, */*",
        "authorization": "Bearer " + access_token,
        "Content-Type": "application/json"
    }

    params = {
        "keyword": query,
        "pageNumber": 1,
        "pageSize": 10
    }

    response = requests.get(url, headers=headers, params=params)
    print(response.json())
    # Get products from response
    products = response.json()['products']

    data = {}
    data['products'] = products

    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
