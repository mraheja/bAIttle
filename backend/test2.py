import openai

system_content = "You are a travel agent. Be descriptive and helpful."
user_content = "Tell me about San Francisco"

class Message:
    def __init__(self, sender, content):
        self.sender = sender
        self.content = content
        
history = [
    Message(0, "you are stupid"),
    Message(1, "you are a clown"),
    Message(0, "you are dumb")
]

messages = [
    {"role": "system", "content": "You are a rap battle bot. You must respond to each roast."},
    {"role": "user", "content": "You're dumb."},
    {"role": "bot", "content": "You're stupid."},
    {"role": "user", "content": "You're clown."},
]

client = openai.OpenAI(
    api_key="3aaddebb6eed068bddc89473a0a5070985b3cbbfb31916fde5842eecc78b9e13",
    base_url="https://api.together.xyz/v1",
    )
chat_completion = client.chat.completions.create(
    model="mistralai/Mixtral-8x7B-Instruct-v0.1",
    messages=messages,
    temperature=0.7,
    max_tokens=1024,
)
response = chat_completion.choices[0].message.content
print("Together response:\n", response)