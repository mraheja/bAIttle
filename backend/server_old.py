import random
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

SYSTEM_PROMPT = "You are a rap battle bot. You must create roast or respond to the given roast. MAKE SURE YOUR ANSWER RHYMES AND LESS THAN 100 CHARACTERS."

class RapMessage:
    def __init__(self, sender, content):
        self.sender = sender
        self.content = content
        
history = []

def get_messages(sender):
    ans = []
    ans.append({"role": "system", "content": SYSTEM_PROMPT})
    if not history:
        ans.append({"role": "user", "content": "Start us off."})
    for rap_message in history:
        ans.append({"role": "bot" if sender == rap_message.sender else "user", "content": rap_message.content})
    return ans

client = openai.OpenAI(
    api_key="3aaddebb6eed068bddc89473a0a5070985b3cbbfb31916fde5842eecc78b9e13",
    base_url="https://api.together.xyz/v1",
    )

current_sender = 0

def truncate_string(input_string):
    LIMIT = 200
    if '\n' in input_string[:LIMIT]:
        return input_string[:input_string[:LIMIT].rindex('.')]
    else:
        return input_string[:LIMIT]

def respond():
    print("sending messages with context:", get_messages(current_sender))
    chat_completion = client.chat.completions.create(
        model="mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages=get_messages(current_sender),
        temperature=0.7,
        max_tokens=1024,
    )
    response = chat_completion.choices[0].message.content
    history.append(RapMessage(current_sender, response))
    response = truncate_string(response)
    return current_sender, response
    
@app.route('/rap_message', methods=['POST', 'GET'])
def index():
    global current_sender
    data = request.get_json()
    sender, response = respond()
    current_sender ^= 1
    return jsonify({'sender': sender, 'response': response})

if __name__ == '__main__':
    print()
    app.run(debug=True)