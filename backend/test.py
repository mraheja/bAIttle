import together

together.api_key="3aaddebb6eed068bddc89473a0a5070985b3cbbfb31916fde5842eecc78b9e13"

class Message:
    def __init__(self, sender, content):
        self.sender = sender
        self.content = content

history = [
    Message(0, "you are stupid"),
    Message(1, "you are a clown"),
    Message(0, "you are dumb")
]

def get_prompt(sender):
    prompt = ""
    for message in history:
        h_sender, content = message.sender, message.content
        if h_sender != sender:
            prompt += "<opponent>: "
        else:
            prompt += "<me>: " 
        prompt += content
        prompt += "\n"
    prompt += "<me>: "

    print(prompt)
    return prompt


# see available models
model_list = together.Models.list()

# print(f"{len(model_list)} models available")

# print the first 10 models on the menu
# model_names = [model_dict['name'] for model_dict in model_list]
# print(model_names[:10])

output = together.Complete.create(
  prompt = get_prompt(1),
  model = "togethercomputer/RedPajama-INCITE-7B-Instruct", 
  max_tokens = 256,
  temperature = 0.8,
  top_k = 60,
  top_p = 0.6,
  repetition_penalty = 1.1,
  stop = ['<opponent>', '\n\n']
)

# print generated text
print("OUTPUT:")
print(output['output']['choices'][0]['text'])