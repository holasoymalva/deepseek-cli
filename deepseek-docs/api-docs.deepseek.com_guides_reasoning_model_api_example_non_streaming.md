---
url: "https://api-docs.deepseek.com/guides/reasoning_model_api_example_non_streaming"
title: "reasoning_model_api_example_non_streaming | DeepSeek API Docs"
---

[Skip to main content](https://api-docs.deepseek.com/guides/reasoning_model_api_example_non_streaming#__docusaurus_skipToContent_fallback)

```codeBlockLines_UUn8
from openai import OpenAI
client = OpenAI(api_key="<DeepSeek API Key>", base_url="https://api.deepseek.com")

# Round 1
messages = [{"role": "user", "content": "9.11 and 9.8, which is greater?"}]
response = client.chat.completions.create(
    model="deepseek-reasoner",
    messages=messages
)

reasoning_content = response.choices[0].message.reasoning_content
content = response.choices[0].message.content

# Round 2
messages.append({'role': 'assistant', 'content': content})
messages.append({'role': 'user', 'content': "How many Rs are there in the word 'strawberry'?"})
response = client.chat.completions.create(
    model="deepseek-reasoner",
    messages=messages
)
# ...

```