---
url: "https://api-docs.deepseek.com/api/create-completion"
title: "Create FIM Completion (Beta) | DeepSeek API Docs"
---

[Skip to main content](https://api-docs.deepseek.com/api/create-completion#__docusaurus_skipToContent_fallback)

# Create FIM Completion (Beta)

```
POST https://api.deepseek.com/beta/completions
```

The FIM (Fill-In-the-Middle) Completion API.
User must set `base_url="https://api.deepseek.com/beta"` to use this feature.

## Request [​](https://api-docs.deepseek.com/api/create-completion\#request "Direct link to Request")

- application/json

### Body

**required**

**model** stringrequired

**Possible values:** \[ `deepseek-chat`\]

ID of the model to use.

**prompt** stringrequired

**Default value:** `Once upon a time, `

The prompt to generate completions for.

**echo** booleannullable

Echo back the prompt in addition to the completion

**frequency\_penalty** numbernullable

**Possible values:** `>= -2` and `<= 2`

**Default value:** `0`

Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.

**logprobs** integernullable

**Possible values:** `<= 20`

Include the log probabilities on the `logprobs` most likely output tokens, as well the chosen tokens. For example, if `logprobs` is 20, the API will return a list of the 20 most likely tokens. The API will always return the `logprob` of the sampled token, so there may be up to `logprobs+1` elements in the response.

The maximum value for `logprobs` is 20.

**max\_tokens** integernullable

The maximum number of tokens that can be generated in the completion.

**presence\_penalty** numbernullable

**Possible values:** `>= -2` and `<= 2`

**Default value:** `0`

Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.

**stop**
object
**nullable**

Up to 16 sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence.

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

Whether to stream back partial progress. If set, tokens will be sent as data-only [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) as they become available, with the stream terminated by a `data: [DONE]` message. [Example Python code](https://cookbook.openai.com/examples/how_to_stream_completions).

**stream\_options**
object

nullable

Options for streaming response. Only set this when you set `stream: true`.

**include\_usage** boolean

If set, an additional chunk will be streamed before the `data: [DONE]` message. The `usage` field on this chunk shows the token usage statistics for the entire request, and the `choices` field will always be an empty array. All other chunks will also include a `usage` field, but with a null value.

**suffix** stringnullable

The suffix that comes after a completion of inserted text.

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

## Responses [​](https://api-docs.deepseek.com/api/create-completion\#responses "Direct link to Responses")

- 200

OK

- application/json

- Schema
- Example (from schema)

**Schema**

**id** stringrequired

A unique identifier for the completion.

**choices**
object\[\]

required

The list of completion choices the model generated for the input prompt.

Array \[\
\
**finish\_reason** stringrequired\
\
**Possible values:** \[ `stop`, `length`, `content_filter`, `insufficient_system_resource`\]\
\
The reason the model stopped generating tokens. This will be `stop` if the model hit a natural stop point or a provided stop sequence,\
`length` if the maximum number of tokens specified in the request was reached,\
\
`content_filter` if content was omitted due to a flag from our content filters,\
or `insufficient_system_resource` if the request is interrupted due to insufficient resource of the inference system.\
\
**index** integerrequired\
\
**logprobs**\
object\
\
nullable\
\
required\
\
**text\_offset** integer\[\]\
\
**token\_logprobs** number\[\]\
\
**tokens** string\[\]\
\
**top\_logprobs** object\[\]\
\
**text** stringrequired\
\
\]

**created** integerrequired

The Unix timestamp (in seconds) of when the completion was created.

**model** stringrequired

The model used for completion.

**system\_fingerprint** string

This fingerprint represents the backend configuration that the model runs with.

**object** stringrequired

**Possible values:** \[ `text_completion`\]

The object type, which is always "text\_completion"

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
      "logprobs": {\
        "text_offset": [\
          0\
        ],\
        "token_logprobs": [\
          0\
        ],\
        "tokens": [\
          "string"\
        ],\
        "top_logprobs": [\
          {}\
        ]\
      },\
      "text": "string"\
    }\
  ],
  "created": 0,
  "model": "string",
  "system_fingerprint": "string",
  "object": "text_completion",
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
curl -L -X POST 'https://api.deepseek.com/beta/completions' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <TOKEN>' \
--data-raw '{
  "model": "deepseek-chat",
  "prompt": "Once upon a time, ",
  "echo": false,
  "frequency_penalty": 0,
  "logprobs": 0,
  "max_tokens": 1024,
  "presence_penalty": 0,
  "stop": null,
  "stream": false,
  "stream_options": null,
  "suffix": null,
  "temperature": 1,
  "top_p": 1
}'

```

Request Collapse all

Base URL

Edit

https://api.deepseek.com/beta

Auth

Bearer Token

Body required

```
{
  "model": "deepseek-chat",
  "prompt": "Once upon a time, ",
  "echo": false,
  "frequency_penalty": 0,
  "logprobs": 0,
  "max_tokens": 1024,
  "presence_penalty": 0,
  "stop": null,
  "stream": false,
  "stream_options": null,
  "suffix": null,
  "temperature": 1,
  "top_p": 1
}

```

Send API Request

ResponseClear

Click the `Send API Request` button above and see the response here!