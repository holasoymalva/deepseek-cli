---
url: "https://api-docs.deepseek.com/guides/fim_completion"
title: "FIM Completion (Beta) | DeepSeek API Docs"
---

[Skip to main content](https://api-docs.deepseek.com/guides/fim_completion#__docusaurus_skipToContent_fallback)

On this page

# FIM Completion (Beta)

In [FIM (Fill In the Middle) completion](https://api-docs.deepseek.com/api/create-completion), users can provide a prefix and a suffix (optional), and the model will complete the content in between. FIM is commonly used for content completion、code completion.

## Notice [​](https://api-docs.deepseek.com/guides/fim_completion\#notice "Direct link to Notice")

1. The max tokens of FIM completion is 4K.
2. The user needs to set `base_url=https://api.deepseek.com/beta` to enable the Beta feature.

## Sample Code [​](https://api-docs.deepseek.com/guides/fim_completion\#sample-code "Direct link to Sample Code")

Below is a complete Python code example for FIM completion. In this example, we provide the beginning and the end of a function to calculate the Fibonacci sequence, allowing the model to complete the content in the middle.

```codeBlockLines_UUn8
from openai import OpenAI

client = OpenAI(
    api_key="<your api key>",
    base_url="https://api.deepseek.com/beta",
)

response = client.completions.create(
    model="deepseek-chat",
    prompt="def fib(a):",
    suffix="    return fib(a-1) + fib(a-2)",
    max_tokens=128
)
print(response.choices[0].text)

```

## Integration With Continue [​](https://api-docs.deepseek.com/guides/fim_completion\#integration-with-continue "Direct link to Integration With Continue")

[Continue](https://continue.dev/) is a VSCode plugin that supports code completion. You can refer to [this document](https://github.com/deepseek-ai/awesome-deepseek-integration/blob/main/docs/continue/README_cn.md) to configure Continue for using the code completion feature.

- [Notice](https://api-docs.deepseek.com/guides/fim_completion#notice)
- [Sample Code](https://api-docs.deepseek.com/guides/fim_completion#sample-code)
- [Integration With Continue](https://api-docs.deepseek.com/guides/fim_completion#integration-with-continue)