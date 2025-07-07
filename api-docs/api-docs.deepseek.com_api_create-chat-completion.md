---
url: "https://api-docs.deepseek.com/api/create-chat-completion"
title: "Create Chat Completion | DeepSeek API Docs"
---

[Skip to main content](https://api-docs.deepseek.com/api/create-chat-completion#__docusaurus_skipToContent_fallback)

# Create Chat Completion

```
POST https://api.deepseek.com/chat/completions
```

Creates a model response for the given chat conversation.

## Request [​](https://api-docs.deepseek.com/api/create-chat-completion\#request "Direct link to Request")

- application/json

### Body

**required**

**messages**
object\[\]

required

**Possible values:** `>= 1`

A list of messages comprising the conversation so far.

Array \[\
\
oneOf\
\
- System message\
- User message\
- Assistant message\
- Tool message\
\
**content** stringrequired\
\
The contents of the system message.\
\
**role** stringrequired\
\
**Possible values:** \[ `system`\]\
\
The role of the messages author, in this case `system`.\
\
**name** string\
\
An optional name for the participant. Provides the model information to differentiate between participants of the same role.\
\
**content** Text content (string)required\
\
The contents of the user message.\
\
**role** stringrequired\
\
**Possible values:** \[ `user`\]\
\
The role of the messages author, in this case `user`.\
\
**name** string\
\
An optional name for the participant. Provides the model information to differentiate between participants of the same role.\
\
**content** stringnullablerequired\
\
The contents of the assistant message.\
\
**role** stringrequired\
\
**Possible values:** \[ `assistant`\]\
\
The role of the messages author, in this case `assistant`.\
\
**name** string\
\
An optional name for the participant. Provides the model information to differentiate between participants of the same role.\
\
**prefix** bool\
\
(Beta) Set this to `true` to force the model to start its answer by the content of the supplied prefix in this `assistant` message.\
You must set `base_url="https://api.deepseek.com/beta"` to use this feature.\
\
**reasoning\_content** stringnullable\
\
(Beta) Used for the `deepseek-reasoner` model in the [Chat Prefix Completion](https://api-docs.deepseek.com/guides/chat_prefix_completion) feature as the input for the CoT in the last assistant message. When using this feature, the `prefix` parameter must be set to `true`.\
\
**role** stringrequired\
\
**Possible values:** \[ `tool`\]\
\
The role of the messages author, in this case `tool`.\
\
**content** Text content (string)required\
\
The contents of the tool message.\
\
**tool\_call\_id** stringrequired\
\
Tool call that this message is responding to.\
\
\]

**model** stringrequired

**Possible values:** \[ `deepseek-chat`, `deepseek-reasoner`\]

ID of the model to use. You can use deepseek-chat.

**frequency\_penalty** numbernullable

**Possible values:** `>= -2` and `<= 2`

**Default value:** `0`

Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.

**max\_tokens** integernullable

**Possible values:** `> 1`

Integer between 1 and 8192. The maximum number of tokens that can be generated in the chat completion.

The total length of input tokens and generated tokens is limited by the model's context length.

If `max_tokens` is not specified, the default value 4096 is used.

**presence\_penalty** numbernullable

**Possible values:** `>= -2` and `<= 2`

**Default value:** `0`

Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.

**response\_format**
object

nullable

An object specifying the format that the model must output.
Setting to { "type": "json\_object" } enables JSON Output, which guarantees the message the model generates is valid JSON.

**Important:** When using JSON Output, you must also instruct the model to produce JSON yourself via a system or user message. Without this, the model may generate an unending stream of whitespace until the generation reaches the token limit, resulting in a long-running and seemingly "stuck" request. Also note that the message content may be partially cut off if finish\_reason="length", which indicates the generation exceeded max\_tokens or the conversation exceeded the max context length.

**type** string

**Possible values:** \[ `text`, `json_object`\]

**Default value:** `text`

Must be one of `text` or `json_object`.

**stop**
object
**nullable**

Up to 16 sequences where the API will stop generating further tokens.

oneOf

- MOD1
- MOD2

string

Array \[\
\
string\
\
\]

**stream** booleannullable

If set, partial message deltas will be sent. Tokens will be sent as data-only server-sent events (SSE) as they become available, with the stream terminated by a `data: [DONE]` message.

**stream\_options**
object

nullable

Options for streaming response. Only set this when you set `stream: true`.

**include\_usage** boolean

If set, an additional chunk will be streamed before the `data: [DONE]` message. The `usage` field on this chunk shows the token usage statistics for the entire request, and the `choices` field will always be an empty array. All other chunks will also include a `usage` field, but with a null value.

**temperature** numbernullable

**Possible values:** `<= 2`

**Default value:** `1`

What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.

We generally recommend altering this or `top_p` but not both.

**top\_p** numbernullable

**Possible values:** `<= 1`

**Default value:** `1`

An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top\_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.

We generally recommend altering this or `temperature` but not both.

**tools**
object\[\]

nullable

A list of tools the model may call. Currently, only functions are supported as a tool.
Use this to provide a list of functions the model may generate JSON inputs for. A max of 128 functions are supported.

Array \[\
\
**type** stringrequired\
\
**Possible values:** \[ `function`\]\
\
The type of the tool. Currently, only `function` is supported.\
\
**function**\
object\
\
required\
\
**description** string\
\
A description of what the function does, used by the model to choose when and how to call the function.\
\
**name** stringrequired\
\
The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.\
\
**parameters**\
object\
\
The parameters the functions accepts, described as a JSON Schema object. See the [Function Calling Guide](https://api-docs.deepseek.com/guides/function_calling) for examples, and the [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for documentation about the format.\
\
Omitting `parameters` defines a function with an empty parameter list.\
\
**property name\*** any\
\
The parameters the functions accepts, described as a JSON Schema object. See the [Function Calling Guide](https://api-docs.deepseek.com/guides/function_calling) for examples, and the [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for documentation about the format.\
\
Omitting `parameters` defines a function with an empty parameter list.\
\
\]

**tool\_choice**
object
**nullable**

Controls which (if any) tool is called by the model.

`none` means the model will not call any tool and instead generates a message.

`auto` means the model can pick between generating a message or calling one or more tools.

`required` means the model must call one or more tools.

Specifying a particular tool via `{"type": "function", "function": {"name": "my_function"}}` forces the model to call that tool.

`none` is the default when no tools are present. `auto` is the default if tools are present.

oneOf

- ChatCompletionToolChoice
- ChatCompletionNamedToolChoice

string

**Possible values:** \[ `none`, `auto`, `required`\]

**type** stringrequired

**Possible values:** \[ `function`\]

The type of the tool. Currently, only `function` is supported.

**function**
object

required

**name** stringrequired

The name of the function to call.

**logprobs** booleannullable

Whether to return log probabilities of the output tokens or not. If true, returns the log probabilities of each output token returned in the `content` of `message`.

**top\_logprobs** integernullable

**Possible values:** `<= 20`

An integer between 0 and 20 specifying the number of most likely tokens to return at each token position, each with an associated log probability. `logprobs` must be set to `true` if this parameter is used.

## Responses [​](https://api-docs.deepseek.com/api/create-chat-completion\#responses "Direct link to Responses")

- 200 (No streaming)
- 200 (Streaming)

OK, returns a `chat completion object`

- application/json

- Schema
- Example (from schema)
- Example

**Schema**

**id** stringrequired

A unique identifier for the chat completion.

**choices**
object\[\]

required

A list of chat completion choices.

Array \[\
\
**finish\_reason** stringrequired\
\
**Possible values:** \[ `stop`, `length`, `content_filter`, `tool_calls`, `insufficient_system_resource`\]\
\
The reason the model stopped generating tokens. This will be `stop` if the model hit a natural stop point or a provided stop sequence,\
`length` if the maximum number of tokens specified in the request was reached,\
`content_filter` if content was omitted due to a flag from our content filters,\
`tool_calls` if the model called a tool,\
or `insufficient_system_resource` if the request is interrupted due to insufficient resource of the inference system.\
\
**index** integerrequired\
\
The index of the choice in the list of choices.\
\
**message**\
object\
\
required\
\
A chat completion message generated by the model.\
\
**content** stringnullablerequired\
\
The contents of the message.\
\
**reasoning\_content** stringnullable\
\
For `deepseek-reasoner` model only. The reasoning contents of the assistant message, before the final answer.\
\
**tool\_calls**\
object\[\]\
\
The tool calls generated by the model, such as function calls.\
\
Array \[\
\
**id** stringrequired\
\
The ID of the tool call.\
\
**type** stringrequired\
\
**Possible values:** \[ `function`\]\
\
The type of the tool. Currently, only `function` is supported.\
\
**function**\
object\
\
required\
\
The function that the model called.\
\
**name** stringrequired\
\
The name of the function to call.\
\
**arguments** stringrequired\
\
The arguments to call the function with, as generated by the model in JSON format. Note that the model does not always generate valid JSON, and may hallucinate parameters not defined by your function schema. Validate the arguments in your code before calling your function.\
\
\]\
\
**role** stringrequired\
\
**Possible values:** \[ `assistant`\]\
\
The role of the author of this message.\
\
**logprobs**\
object\
\
nullable\
\
required\
\
Log probability information for the choice.\
\
**content**\
object\[\]\
\
nullable\
\
required\
\
A list of message content tokens with log probability information.\
\
Array \[\
\
**token** stringrequired\
\
The token.\
\
**logprob** numberrequired\
\
The log probability of this token, if it is within the top 20 most likely tokens. Otherwise, the value `-9999.0` is used to signify that the token is very unlikely.\
\
**bytes** integer\[\]nullablerequired\
\
A list of integers representing the UTF-8 bytes representation of the token. Useful in instances where characters are represented by multiple tokens and their byte representations must be combined to generate the correct text representation. Can be `null` if there is no bytes representation for the token.\
\
**top\_logprobs**\
object\[\]\
\
required\
\
List of the most likely tokens and their log probability, at this token position. In rare cases, there may be fewer than the number of requested `top_logprobs` returned.\
\
Array \[\
\
**token** stringrequired\
\
The token.\
\
**logprob** numberrequired\
\
The log probability of this token, if it is within the top 20 most likely tokens. Otherwise, the value `-9999.0` is used to signify that the token is very unlikely.\
\
**bytes** integer\[\]nullablerequired\
\
A list of integers representing the UTF-8 bytes representation of the token. Useful in instances where characters are represented by multiple tokens and their byte representations must be combined to generate the correct text representation. Can be `null` if there is no bytes representation for the token.\
\
\]\
\
\]\
\
\]

**created** integerrequired

The Unix timestamp (in seconds) of when the chat completion was created.

**model** stringrequired

The model used for the chat completion.

**system\_fingerprint** stringrequired

This fingerprint represents the backend configuration that the model runs with.

**object** stringrequired

**Possible values:** \[ `chat.completion`\]

The object type, which is always `chat.completion`.

**usage**
object

Usage statistics for the completion request.

**completion\_tokens** integerrequired

Number of tokens in the generated completion.

**prompt\_tokens** integerrequired

Number of tokens in the prompt. It equals prompt\_cache\_hit\_tokens + prompt\_cache\_miss\_tokens.

**prompt\_cache\_hit\_tokens** integerrequired

Number of tokens in the prompt that hits the context cache.

**prompt\_cache\_miss\_tokens** integerrequired

Number of tokens in the prompt that misses the context cache.

**total\_tokens** integerrequired

Total number of tokens used in the request (prompt + completion).

**completion\_tokens\_details**
object

Breakdown of tokens used in a completion.

**reasoning\_tokens** integer

Tokens generated by the model for reasoning.

```codeBlockLines_UUn8
{
  "id": "string",
  "choices": [\
    {\
      "finish_reason": "stop",\
      "index": 0,\
      "message": {\
        "content": "string",\
        "reasoning_content": "string",\
        "tool_calls": [\
          {\
            "id": "string",\
            "type": "function",\
            "function": {\
              "name": "string",\
              "arguments": "string"\
            }\
          }\
        ],\
        "role": "assistant"\
      },\
      "logprobs": {\
        "content": [\
          {\
            "token": "string",\
            "logprob": 0,\
            "bytes": [\
              0\
            ],\
            "top_logprobs": [\
              {\
                "token": "string",\
                "logprob": 0,\
                "bytes": [\
                  0\
                ]\
              }\
            ]\
          }\
        ]\
      }\
    }\
  ],
  "created": 0,
  "model": "string",
  "system_fingerprint": "string",
  "object": "chat.completion",
  "usage": {
    "completion_tokens": 0,
    "prompt_tokens": 0,
    "prompt_cache_hit_tokens": 0,
    "prompt_cache_miss_tokens": 0,
    "total_tokens": 0,
    "completion_tokens_details": {
      "reasoning_tokens": 0
    }
  }
}

```

```codeBlockLines_UUn8
{
  "id": "930c60df-bf64-41c9-a88e-3ec75f81e00e",
  "choices": [\
    {\
      "finish_reason": "stop",\
      "index": 0,\
      "message": {\
        "content": "Hello! How can I help you today?",\
        "role": "assistant"\
      }\
    }\
  ],
  "created": 1705651092,
  "model": "deepseek-chat",
  "object": "chat.completion",
  "usage": {
    "completion_tokens": 10,
    "prompt_tokens": 16,
    "total_tokens": 26
  }
}

```

OK, returns a streamed sequence of `chat completion chunk` objects

- text/event-stream

- Schema
- Example

**Schema**

- Array \[\
\
\
**id** stringrequired\
\
A unique identifier for the chat completion. Each chunk has the same ID.\
\
**choices**\
object\[\]\
\
required\
\
A list of chat completion choices.\
\
Array \[\
\
**delta**\
object\
\
required\
\
A chat completion delta generated by streamed model responses.\
\
**content** stringnullable\
\
The contents of the chunk message.\
\
**reasoning\_content** stringnullable\
\
For `deepseek-reasoner` model only. The reasoning contents of the assistant message, before the final answer.\
\
**role** string\
\
**Possible values:** \[ `assistant`\]\
\
The role of the author of this message.\
\
**finish\_reason** stringnullablerequired\
\
**Possible values:** \[ `stop`, `length`, `content_filter`, `tool_calls`, `insufficient_system_resource`\]\
\
The reason the model stopped generating tokens. This will be `stop` if the model hit a natural stop point or a provided stop sequence,\
`length` if the maximum number of tokens specified in the request was reached,\
`content_filter` if content was omitted due to a flag from our content filters,\
`tool_calls` if the model called a tool,\
or `insufficient_system_resource` if the request is interrupted due to insufficient resource of the inference system.\
\
**index** integerrequired\
\
The index of the choice in the list of choices.\
\
\]\
\
**created** integerrequired\
\
The Unix timestamp (in seconds) of when the chat completion was created. Each chunk has the same timestamp.\
\
**model** stringrequired\
\
The model to generate the completion.\
\
**system\_fingerprint** stringrequired\
\
This fingerprint represents the backend configuration that the model runs with.\
\
**object** stringrequired\
\
**Possible values:** \[ `chat.completion.chunk`\]\
\
The object type, which is always `chat.completion.chunk`.\
\
- \]


```codeBlockLines_UUn8
data: {"id": "1f633d8bfc032625086f14113c411638", "choices": [{"index": 0, "delta": {"content": "", "role": "assistant"}, "finish_reason": null, "logprobs": null}], "created": 1718345013, "model": "deepseek-chat", "system_fingerprint": "fp_a49d71b8a1", "object": "chat.completion.chunk", "usage": null}

data: {"choices": [{"delta": {"content": "Hello", "role": "assistant"}, "finish_reason": null, "index": 0, "logprobs": null}], "created": 1718345013, "id": "1f633d8bfc032625086f14113c411638", "model": "deepseek-chat", "object": "chat.completion.chunk", "system_fingerprint": "fp_a49d71b8a1"}

data: {"choices": [{"delta": {"content": "!", "role": "assistant"}, "finish_reason": null, "index": 0, "logprobs": null}], "created": 1718345013, "id": "1f633d8bfc032625086f14113c411638", "model": "deepseek-chat", "object": "chat.completion.chunk", "system_fingerprint": "fp_a49d71b8a1"}

data: {"choices": [{"delta": {"content": " How", "role": "assistant"}, "finish_reason": null, "index": 0, "logprobs": null}], "created": 1718345013, "id": "1f633d8bfc032625086f14113c411638", "model": "deepseek-chat", "object": "chat.completion.chunk", "system_fingerprint": "fp_a49d71b8a1"}

data: {"choices": [{"delta": {"content": " can", "role": "assistant"}, "finish_reason": null, "index": 0, "logprobs": null}], "created": 1718345013, "id": "1f633d8bfc032625086f14113c411638", "model": "deepseek-chat", "object": "chat.completion.chunk", "system_fingerprint": "fp_a49d71b8a1"}

data: {"choices": [{"delta": {"content": " I", "role": "assistant"}, "finish_reason": null, "index": 0, "logprobs": null}], "created": 1718345013, "id": "1f633d8bfc032625086f14113c411638", "model": "deepseek-chat", "object": "chat.completion.chunk", "system_fingerprint": "fp_a49d71b8a1"}

data: {"choices": [{"delta": {"content": " assist", "role": "assistant"}, "finish_reason": null, "index": 0, "logprobs": null}], "created": 1718345013, "id": "1f633d8bfc032625086f14113c411638", "model": "deepseek-chat", "object": "chat.completion.chunk", "system_fingerprint": "fp_a49d71b8a1"}

data: {"choices": [{"delta": {"content": " you", "role": "assistant"}, "finish_reason": null, "index": 0, "logprobs": null}], "created": 1718345013, "id": "1f633d8bfc032625086f14113c411638", "model": "deepseek-chat", "object": "chat.completion.chunk", "system_fingerprint": "fp_a49d71b8a1"}

data: {"choices": [{"delta": {"content": " today", "role": "assistant"}, "finish_reason": null, "index": 0, "logprobs": null}], "created": 1718345013, "id": "1f633d8bfc032625086f14113c411638", "model": "deepseek-chat", "object": "chat.completion.chunk", "system_fingerprint": "fp_a49d71b8a1"}

data: {"choices": [{"delta": {"content": "?", "role": "assistant"}, "finish_reason": null, "index": 0, "logprobs": null}], "created": 1718345013, "id": "1f633d8bfc032625086f14113c411638", "model": "deepseek-chat", "object": "chat.completion.chunk", "system_fingerprint": "fp_a49d71b8a1"}

data: {"choices": [{"delta": {"content": "", "role": null}, "finish_reason": "stop", "index": 0, "logprobs": null}], "created": 1718345013, "id": "1f633d8bfc032625086f14113c411638", "model": "deepseek-chat", "object": "chat.completion.chunk", "system_fingerprint": "fp_a49d71b8a1", "usage": {"completion_tokens": 9, "prompt_tokens": 17, "total_tokens": 26}}

data: [DONE]

```

- curl
- python
- go
- nodejs
- ruby
- csharp
- php
- java
- powershell

- CURL

```openapi-explorer__code-block-lines openapi-explorer__code-block-lines-numbering
curl -L -X POST 'https://api.deepseek.com/chat/completions' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <TOKEN>' \
--data-raw '{
  "messages": [\
    {\
      "content": "You are a helpful assistant",\
      "role": "system"\
    },\
    {\
      "content": "Hi",\
      "role": "user"\
    }\
  ],
  "model": "deepseek-chat",
  "frequency_penalty": 0,
  "max_tokens": 2048,
  "presence_penalty": 0,
  "response_format": {
    "type": "text"
  },
  "stop": null,
  "stream": false,
  "stream_options": null,
  "temperature": 1,
  "top_p": 1,
  "tools": null,
  "tool_choice": "none",
  "logprobs": false,
  "top_logprobs": null
}'

```

Request Collapse all

Base URL

Edit

https://api.deepseek.com

Auth

Bearer Token

Body required

```
{
  "messages": [\
    {\
      "content": "You are a helpful assistant",\
      "role": "system"\
    },\
    {\
      "content": "Hi",\
      "role": "user"\
    }\
  ],
  "model": "deepseek-chat",
  "frequency_penalty": 0,
  "max_tokens": 2048,
  "presence_penalty": 0,
  "response_format": {
    "type": "text"
  },
  "stop": null,
  "stream": false,
  "stream_options": null,
  "temperature": 1,
  "top_p": 1,
  "tools": null,
  "tool_choice": "none",
  "logprobs": false,
  "top_logprobs": null
}

```

Send API Request

ResponseClear

Click the `Send API Request` button above and see the response here!