---
url: "https://api-docs.deepseek.com/guides/chat_prefix_completion"
title: "Chat Prefix Completion (Beta) | DeepSeek API Docs"
---

[Skip to main content](https://api-docs.deepseek.com/guides/chat_prefix_completion#__docusaurus_skipToContent_fallback)

On this page

# Chat Prefix Completion (Beta)

The chat prefix completion follows the [Chat Completion API](https://api-docs.deepseek.com/api/create-chat-completion), where users provide an assistant's prefix message for the model to complete the rest of the message.

## Notice [​](https://api-docs.deepseek.com/guides/chat_prefix_completion\#notice "Direct link to Notice")

1. When using chat prefix completion, users must ensure that the `role` of the last message in the `messages` list is `assistant` and set the `prefix` parameter of the last message to `True`.
2. The user needs to set `base_url="https://api.deepseek.com/beta"` to enable the Beta feature.

## Sample Code [​](https://api-docs.deepseek.com/guides/chat_prefix_completion\#sample-code "Direct link to Sample Code")

Below is a complete Python code example for chat prefix completion. In this example, we set the prefix message of the `assistant` to ````"```python\n"```` to force the model to output Python code, and set the `stop` parameter to ````['```']```` to prevent additional explanations from the model.

````codeBlockLines_UUn8
from openai import OpenAI

client = OpenAI(
    api_key="<your api key>",
    base_url="https://api.deepseek.com/beta",
)

messages = [\
    {"role": "user", "content": "Please write quick sort code"},\
    {"role": "assistant", "content": "```python\n", "prefix": True}\
]
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=messages,
    stop=["```"],
)
print(response.choices[0].message.content)

````

- [Notice](https://api-docs.deepseek.com/guides/chat_prefix_completion#notice)
- [Sample Code](https://api-docs.deepseek.com/guides/chat_prefix_completion#sample-code)