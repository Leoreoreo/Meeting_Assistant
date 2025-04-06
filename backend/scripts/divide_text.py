import openai
from openai import OpenAI
import os
import json
import re

script_dir = os.path.dirname(os.path.abspath(__file__))
transcript_path = os.path.join(script_dir, 'transcript.txt')
output_file_path = os.path.join(script_dir, 'divided_transcript.json')

openai.api_key = 'my-api-key'

prompt = """You are a helpful agent for an app that creates meeting summaries and mind maps. You will be provided with the transcript of a zoom meeting. Follow these instructions to respond to the input transcript.

Step 1 - Analyze the transcript and identify if there is a major transition where the main topic changes. If such a transition exists, select only the last section after the transition. Otherwise, use the entire transcript. Output the selected text with a prefix title that is a 2-3 word summary of it.

Step 2: Repeat the process until the beginning of the input text is reached.

Step 3: Output your response in json format. {“title1: ” … , "title2:" ..., ...}"""

with open(transcript_path, 'r') as file:
    transcript = file.read()

api_key = openai.api_key

client = OpenAI(
    # This is the default and can be omitted
    api_key=api_key,
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "developer", "content": prompt},
        {
            "role": "user",
            "content": transcript,
        },
    ],
)

response_json = response.choices[0].message.content
response_json = re.sub(r'^```json\n|\n```$', '', response_json).strip().replace(u"\u2018", "'").replace(u"\u2026", "...").replace(u"\u2019", "'").replace(u"\u2014", "-")
print(response_json)

response_dict = json.loads(response_json)

# Save the response to a JSON file
with open(output_file_path, 'w') as json_file:
    json.dump(response_dict, json_file, indent=4)

print(f"Response saved to '{output_file_path}'")


