from dataclasses import dataclass
import requests
from typing import Dict, List
import together
import openai
import numpy as np
from tqdm import tqdm
import random
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


history = []

class RapMessage:
    def __init__(self, sender, content):
        self.sender = sender
        self.content = content

SYSTEM_PROMPT = (
    "You are a rap battle bot. You must create roast or respond to the given roast. "
    "You will be presented with extra information to use while writing the lyrics to your rap verse. "
    "Extra information: {}"
    "Respond in the form of a rap verse. Your response must RHYME and be SHORTER THAN 100 CHARACTERS."
    "Only respond with the rap verse. Do not include any other text in your response."
)

def get_messages(sender, extra_info):
    ans = []
    ans.append({"role": "system", "content": SYSTEM_PROMPT.format(extra_info)})
    if not history:
        ans.append({"role": "user", "content": "Start us off."})
    for rap_message in history[-1:]:
        ans.append({"role": "bot" if sender == rap_message.sender else "user", "content": rap_message.content})
    return ans

# TOGETHER_API_KEY = "a05d2b42275510895e85eb1d27c6d1d414e9f149327170ff4f98a7ae0e94e8be"
TOGETHER_API_KEY = "aeca5849e9380c0131d257eba5a73a0fa184b69e70f7ecd62c9afa53d1cef4f9"
TOGETHER_MODEL_NAME = "togethercomputer/m2-bert-80M-8k-retrieval"
EMBEDDING_CHUNK_SIZE = 128

together.api_key = TOGETHER_API_KEY
client = together.Together()

@dataclass
class InfoIndex:
    # n_chunks x embed_dim
    embeddings: np.ndarray

    # map: row idx -> embedded document
    docs: Dict[int, str]


def get_embeddings(texts: List[str], model: str) -> List[List[float]]:
    texts = [text.replace("\n", " ") for text in texts]
    outputs = client.embeddings.create(input = texts, model=model)
    return [outputs.data[i].embedding for i in range(len(texts))]

def search_wikipedia_articles(search_string):
    """
    Search for Wikipedia articles with titles that contain the search string.

    :param search_string: The string to search for in article titles.
    :return: List of article titles.
    """
    URL = "https://en.wikipedia.org/w/api.php"
    params = {
        'action': 'query',
        'list': 'search',
        'srsearch': search_string,
        'format': 'json',
        'srlimit': 500  # Adjust as needed, up to a maximum of 500 for non-bots
    }

    response = requests.get(URL, params=params)
    search_results = response.json()

    titles = [item['title'] for item in search_results['query']['search']]
    return titles

def get_wikipedia_article(title):
    """
    Fetch the content of a Wikipedia article using Wikipedia API.

    :param title: Title of the Wikipedia article.
    :return: Text content of the article.
    """
    URL = "https://en.wikipedia.org/w/api.php"
    params = {
        'action': 'query',
        'format': 'json',
        'titles': title,
        'prop': 'extracts',
        'explaintext': True
    }

    response = requests.get(URL, params=params)
    data = response.json()

    page = next(iter(data['query']['pages'].values()))
    return page['extract'] if 'extract' in page else 'Article not found.'

def get_wikipedia_article_links(title):
    """
    Fetch the links of a Wikipedia article using the Wikipedia API.

    :param title: Title of the Wikipedia article.
    :return: List of links (article titles) within the article.
    """
    URL = "https://en.wikipedia.org/w/api.php"
    params = {
        'action': 'query',
        'format': 'json',
        'titles': title,
        'prop': 'links',
        'pllimit': 'max'
    }

    response = requests.get(URL, params=params)
    data = response.json()

    page = next(iter(data['query']['pages'].values()))
    links = [link['title'] for link in page.get('links', []) if 'title' in link]
    return links


def embed_articles(article_name: str) -> InfoIndex:
    articles = [article_name] + get_wikipedia_article_links(article_name)
    print("getting wikipedia articles")
    articles = articles[:1]
    texts = [get_wikipedia_article(title) for title in tqdm(articles)]
    embeddings = []

    # map from row idx to text of embedded document
    docs = {}

    print("embedding chunks")
    print("len(articles) = ", len(articles))
    print("len(texts) = ", len(texts))
    chunks = []
    for i, text in tqdm(enumerate(texts)):
        words = text.split(" ")

        for j in range(0, len(words), EMBEDDING_CHUNK_SIZE):
            chunk = " ".join(words[j:j+EMBEDDING_CHUNK_SIZE])

            embedding_prompt = f"Article title: {articles[i]}\nText: {chunk}"
            chunks.append(embedding_prompt)

        for k in range(len(embeddings), len(embeddings) + len(chunks)):
            docs[k] = chunks[k - len(embeddings)]

    embeddings.extend(get_embeddings(chunks, TOGETHER_MODEL_NAME))

    # n_chunks x 768
    embeddings_arr = np.array(embeddings)
    return InfoIndex(embeddings_arr, docs)

def get_article_header(article_name: str):
    article_text = get_wikipedia_article(article_name)
    joined_text = " ".join(article_text.split(" ")[:128])

    return joined_text

def initial_rap_prompt(speaker: str, respondent: str):
    speaker_header = get_article_header(speaker)
    respondent_header = get_article_header(respondent)

    return (
        f"You are playing the role of {speaker}. Here is some information about {speaker}:\n"
        f"{speaker_header}\n"
        f"Your opponent is {respondent}. Here is some information about {respondent}:\n"
        f"{respondent_header}\n"
    )

def proceeding_rap_prompt(
    speaker: str,
    speaker_embeds: InfoIndex,
    respondent: str,
    respondent_embeds: InfoIndex,
    prev_message: str,
    n_chunks = 2,
):
    print(prev_message)
    queries = np.array(get_embeddings([prev_message], TOGETHER_MODEL_NAME))

    # map from score to text
    best_chunks = {}

    for embeds in [speaker_embeds, respondent_embeds]:
        # (docs, e) x (e, queries) -> (docs, queries)
        infos = embeds.embeddings @ queries.T

        q_maxs = np.max(infos, axis=1)
        q_max_idx = np.argmax(infos, axis=1)

        for max_val, max_idx in zip(q_maxs, q_max_idx):
            if max_val in best_chunks:
                best_chunks[max_val].append(embeds.docs[max_idx])
            else:
                best_chunks[max_val] = [embeds.docs[max_idx]]

    sorted_scores = sorted(best_chunks.keys())

    info_chunks = []

    while len(info_chunks) < n_chunks:
        info_chunks.extend(best_chunks[sorted_scores[-1]])
        sorted_scores.pop()

    return (
        f"You are playing the role of {speaker}. Your opponent is {respondent}.\n"
        f"Some relevant information about you and your opponent: \n"
        f"{' '.join(info_chunks)}\n"
    )
    
    
guy1 = "Woodrow Wilson"
guy2 = "Alan Turing"

def send_messages(
    message,
    model,
    temperature,
    max_tokens,
):
    oai_client = openai.OpenAI(
        api_key="3aaddebb6eed068bddc89473a0a5070985b3cbbfb31916fde5842eecc78b9e13",
        base_url="https://api.together.xyz/v1",
    )
    print("Sending message with context:", message)
    chat_completion = oai_client.chat.completions.create(
        model=model,
        messages=message,
        temperature=temperature,
        # max_tokens=max_tokens,
    )

    return chat_completion.choices[0].message.content
    
info1, info2 = "", ""
first = False

@app.route('/setup_rap', methods=['POST', 'GET'])
def setup():
    global info1, info2
    global first
    print("embedding articles for", guy1)
    info1 = embed_articles(guy1)
    print("embedding articles for", guy2)
    info2 = embed_articles(guy2)
    
    first = True
    prompt1 = initial_rap_prompt(guy1, guy2)
    
def truncate_string(input_string):
    LIMIT = 200
    if '\n' in input_string[:LIMIT]:
        return input_string[:input_string[:LIMIT].rindex('.')]
    else:
        return input_string[:LIMIT]
    
current_sender = 0
response = ""

@app.route('/rap_message', methods=['POST', 'GET'])
def index():
    global current_sender
    global response
    
    if first:
        prompt1 = initial_rap_prompt(guy1, guy2)
        initial_message = get_messages(
            guy1, prompt1
        )
        response = send_messages(
            initial_message,
            "meta-llama/Llama-2-70b-chat-hf",
            0.7,
            8192,
        )
        history.append(RapMessage(guy1, response))
        
        send_sender = current_sender
        current_sender ^= 1
        return jsonify({'sender': send_sender, 'response': truncate_string(response)})
    
    if current_sender == 0:
        message = get_messages(
            guy2,
            proceeding_rap_prompt(
                guy2,
                info2,
                guy1,
                info1,
                response,
            )
        )
        
        response = send_messages(
            message,
            "meta-llama/Llama-2-70b-chat-hf",
            0.7,
            8192,
        )
        
        history.append(RapMessage(guy2, response))
        send_sender = current_sender
        current_sender ^= 1
        return jsonify({'sender': send_sender, 'response': truncate_string(response)})
    else:
        message = get_messages(
            guy1,
            proceeding_rap_prompt(
                guy1,
                info1,
                guy2,
                info2,
                response,
            )
        )

        response = send_messages(
            message,
            "meta-llama/Llama-2-70b-chat-hf",
            0.7,
            8192,
        )
        history.append(RapMessage(guy2, response))
        send_sender = current_sender
        current_sender ^= 1
        return jsonify({'sender': send_sender, 'response': truncate_string(response)})
    
    
if __name__ == '__main__':
    setup()
    app.run(debug=True)    