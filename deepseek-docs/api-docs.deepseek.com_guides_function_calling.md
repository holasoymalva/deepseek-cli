---
url: "https://api-docs.deepseek.com/guides/function_calling"
title: "Function Calling | DeepSeek API Docs"
---

[Skip to main content](https://api-docs.deepseek.com/guides/function_calling#__docusaurus_skipToContent_fallback)

On this page

# Function Calling

Function Calling allows the model to call external tools to enhance its capabilities.

## Sample Code [​](https://api-docs.deepseek.com/guides/function_calling\#sample-code "Direct link to Sample Code")

Here is an example of using Function Calling to get the current weather information of the user's location, demonstrated with complete Python code.

For the specific API format of Function Calling, please refer to the [Chat Completion](https://api-docs.deepseek.com/api/create-chat-completion/) documentation.

```codeBlockLines_UUn8
from openai import OpenAI

def send_messages(messages):
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=messages,
        tools=tools
    )
    return response.choices[0].message

client = OpenAI(
    api_key="<your api key>",
    base_url="https://api.deepseek.com",
)

tools = [\
    {\
        "type": "function",\
        "function": {\
            "name": "get_weather",\
            "description": "Get weather of an location, the user shoud supply a location first",\
            "parameters": {\
                "type": "object",\
                "properties": {\
                    "location": {\
                        "type": "string",\
                        "description": "The city and state, e.g. San Francisco, CA",\
                    }\
                },\
                "required": ["location"]\
            },\
        }\
    },\
]

messages = [{"role": "user", "content": "How's the weather in Hangzhou?"}]
message = send_messages(messages)
print(f"User>\t {messages[0]['content']}")

tool = message.tool_calls[0]
messages.append(message)

messages.append({"role": "tool", "tool_call_id": tool.id, "content": "24℃"})
message = send_messages(messages)
print(f"Model>\t {message.content}")

```

The execution flow of this example is as follows:

1. User: Asks about the current weather in Hangzhou
2. Model: Returns the function `get_weather({location: 'Hangzhou'})`
3. User: Calls the function `get_weather({location: 'Hangzhou'})` and provides the result to the model
4. Model: Returns in natural language, "The current temperature in Hangzhou is 24°C."

Note: In the above code, the functionality of the `get_weather` function needs to be provided by the user. The model itself does not execute specific functions.

- [Sample Code](https://api-docs.deepseek.com/guides/function_calling#sample-code)