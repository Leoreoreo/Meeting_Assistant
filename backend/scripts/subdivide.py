import openai
from openai import OpenAI
import os
import json
import re

from divide_text import api_key

script_dir = os.path.dirname(os.path.abspath(__file__))
transcript_path = os.path.join(script_dir, 'divided_transcript.json')
output_file_path = os.path.join(script_dir, 'subdivided_transcript.json')

prompt = """
You are a helpful agent for an app that creates meeting summaries and mind maps. 
You will be provided with a JSON file containing a transcript that has already been divided into several parts. Your task is to divide each part into smaller sub-sections based on the content and flow of the discussion.

Follow these steps to respond to the input:

1. **Analyze Each Text Block**: For each "text" block in the provided JSON, divide it further into smaller, meaningful sub-sections based on the content. Each subdivision should correspond to a change in topic, speaker, or major transition within the text. Make at most 3 subdivisions.

2. **Prefix Each Sub-division with a Title and a colon: The title is a 1-3 words summary of the sub-division

3. **JSON Output**: Your response should be a list of JSON objects, with each text block in the input text representing object. The output format should be:

   ```json
   [
     {
       "title1": "First subdivision of the first block of text",
       "title2": "Second subdivision of the first block of text"
     },
     {
       "title1": "First subdivision of the second block of text",
       "title2": "Second subdivision of the second block of text"
     }
   ]    
"""
with open(transcript_path, 'r') as file:
    transcript = file.read()

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