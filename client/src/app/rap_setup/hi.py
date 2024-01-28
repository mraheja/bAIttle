import together

together.api_key = "3aaddebb6eed068bddc89473a0a5070985b3cbbfb31916fde5842eecc78b9e13"

# see available models
model_list = together.Models.list()

print(f"{len(model_list)} models available")

# print the first 10 models on the menu
model_names = [model_dict['name'] for model_dict in model_list]
print([e for e in model_names if "instruct" in e])