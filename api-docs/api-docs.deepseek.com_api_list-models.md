---
url: "https://api-docs.deepseek.com/api/list-models"
title: "Lists Models | DeepSeek API Docs"
---

[Skip to main content](https://api-docs.deepseek.com/api/list-models#__docusaurus_skipToContent_fallback)

# Lists Models

```
GET https://api.deepseek.com/models
```

Lists the currently available models, and provides basic information about each one such as the owner and availability. Check [Models & Pricing](https://api-docs.deepseek.com/quick_start/pricing) for our currently supported models.

## Responses [​](https://api-docs.deepseek.com/api/list-models\#responses "Direct link to Responses")

- 200

OK, returns A list of models

- application/json

- Schema
- Example (from schema)
- Example

**Schema**

**object** stringrequired

**Possible values:** \[ `list`\]

**data**
Model\[\]

required

Array \[\
\
**id** stringrequired\
\
The model identifier, which can be referenced in the API endpoints.\
\
**object** stringrequired\
\
**Possible values:** \[ `model`\]\
\
The object type, which is always "model".\
\
**owned\_by** stringrequired\
\
The organization that owns the model.\
\
\]

```codeBlockLines_UUn8
{
  "object": "list",
  "data": [\
    {\
      "id": "string",\
      "object": "model",\
      "owned_by": "string"\
    }\
  ]
}

```

```codeBlockLines_UUn8
{
  "object": "list",
  "data": [\
    {\
      "id": "deepseek-chat",\
      "object": "model",\
      "owned_by": "deepseek"\
    },\
    {\
      "id": "deepseek-reasoner",\
      "object": "model",\
      "owned_by": "deepseek"\
    }\
  ]
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
curl -L -X GET 'https://api.deepseek.com/models' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <TOKEN>'

```

Request Collapse all

Base URL

Edit

https://api.deepseek.com

Auth

Bearer Token

Send API Request

ResponseClear

Click the `Send API Request` button above and see the response here!