---
url: "https://api-docs.deepseek.com/api/get-user-balance"
title: "Get User Balance | DeepSeek API Docs"
---

[Skip to main content](https://api-docs.deepseek.com/api/get-user-balance#__docusaurus_skipToContent_fallback)

# Get User Balance

```
GET https://api.deepseek.com/user/balance
```

Get user current balance

## Responses [​](https://api-docs.deepseek.com/api/get-user-balance\#responses "Direct link to Responses")

- 200

OK, returns user balance info.

- application/json

- Schema
- Example (from schema)
- Example

**Schema**

**is\_available** boolean

Whether the user's balance is sufficient for API calls.

**balance\_infos**
object\[\]

Array \[\
\
**currency** string\
\
**Possible values:** \[ `CNY`, `USD`\]\
\
The currency of the balance.\
\
**total\_balance** string\
\
The total available balance, including the granted balance and the topped-up balance.\
\
**granted\_balance** string\
\
The total not expired granted balance.\
\
**topped\_up\_balance** string\
\
The total topped-up balance.\
\
\]

```codeBlockLines_UUn8
{
  "is_available": true,
  "balance_infos": [\
    {\
      "currency": "CNY",\
      "total_balance": "110.00",\
      "granted_balance": "10.00",\
      "topped_up_balance": "100.00"\
    }\
  ]
}

```

```codeBlockLines_UUn8
{
  "is_available": true,
  "balance_infos": [\
    {\
      "currency": "CNY",\
      "total_balance": "110.00",\
      "granted_balance": "10.00",\
      "topped_up_balance": "100.00"\
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
curl -L -X GET 'https://api.deepseek.com/user/balance' \
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