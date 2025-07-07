# pip3 install transformers
# python3 deepseek_tokenizer.py
import transformers

chat_tokenizer_dir = "./"

tokenizer = transformers.AutoTokenizer.from_pretrained( 
        chat_tokenizer_dir, trust_remote_code=True
        )

result = tokenizer.encode("Hello!")
print(result)
