#!/usr/bin/env python3
"""
DeepSeek V3 Token Counter

This script provides a simple way to count tokens for the DeepSeek V3 model.
It uses a basic regex-based approach to approximate token counts without
requiring the full tokenizer model.

Usage:
  python3 token_counter.py "Your text here"
  python3 token_counter.py --file input.txt

Note: This is an approximation and may not match the exact token count
used by the DeepSeek API.
"""

import re
import sys
import argparse
import json

def count_tokens_simple(text):
    """
    A simple approximation of token counting.
    This is not as accurate as using the actual tokenizer but gives a reasonable estimate.
    """
    # Split on whitespace and punctuation
    tokens = re.findall(r'\b\w+\b|[^\w\s]', text)
    
    # Adjust for special cases
    # 1. Numbers are usually tokenized as individual digits
    digit_tokens = 0
    for token in tokens:
        if re.match(r'^\d+$', token):
            # Each digit is typically a separate token
            digit_tokens += len(token) - 1
    
    # 2. Special characters and punctuation are usually separate tokens
    special_chars = len(re.findall(r'[^\w\s]', text))
    
    # 3. Adjust for common prefixes/suffixes that might be separate tokens
    common_affixes = len(re.findall(r'\b(un|re|in|dis|able|ment|tion|ing|ed|ly)\b', text, re.IGNORECASE))
    
    # Base count + adjustments
    return len(tokens) + digit_tokens + common_affixes

def count_tokens_from_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            text = file.read()
        return count_tokens_simple(text)
    except Exception as e:
        print(f"Error reading file: {e}")
        return 0

def estimate_cost(token_count, model="deepseek-chat", time_period="standard"):
    """
    Estimate the cost of API calls based on token count.
    
    Args:
        token_count: Number of tokens
        model: 'deepseek-chat' or 'deepseek-reasoner'
        time_period: 'standard' (UTC 00:30-16:30) or 'discount' (UTC 16:30-00:30)
    
    Returns:
        Dictionary with cost estimates
    """
    # Pricing per 1M tokens
    pricing = {
        "deepseek-chat": {
            "standard": {
                "input_cache_hit": 0.07,
                "input_cache_miss": 0.27,
                "output": 1.10
            },
            "discount": {
                "input_cache_hit": 0.035,
                "input_cache_miss": 0.135,
                "output": 0.550
            }
        },
        "deepseek-reasoner": {
            "standard": {
                "input_cache_hit": 0.14,
                "input_cache_miss": 0.55,
                "output": 2.19
            },
            "discount": {
                "input_cache_hit": 0.035,
                "input_cache_miss": 0.135,
                "output": 0.550
            }
        }
    }
    
    # Get the appropriate pricing
    model_pricing = pricing.get(model, pricing["deepseek-chat"])
    period_pricing = model_pricing.get(time_period, model_pricing["standard"])
    
    # Calculate costs per million tokens
    cost_per_million = {
        "input_cache_hit": period_pricing["input_cache_hit"],
        "input_cache_miss": period_pricing["input_cache_miss"],
        "output": period_pricing["output"]
    }
    
    # Calculate actual costs
    token_count_in_millions = token_count / 1000000
    costs = {
        "input_cache_hit": cost_per_million["input_cache_hit"] * token_count_in_millions,
        "input_cache_miss": cost_per_million["input_cache_miss"] * token_count_in_millions,
        "output_same_length": cost_per_million["output"] * token_count_in_millions,
        "total_cache_hit": (cost_per_million["input_cache_hit"] + cost_per_million["output"]) * token_count_in_millions,
        "total_cache_miss": (cost_per_million["input_cache_miss"] + cost_per_million["output"]) * token_count_in_millions
    }
    
    return {
        "token_count": token_count,
        "model": model,
        "time_period": time_period,
        "costs": costs
    }

def main():
    parser = argparse.ArgumentParser(description='Count tokens for DeepSeek V3 model')
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('text', nargs='?', help='Text to count tokens for')
    group.add_argument('--file', help='File to count tokens for')
    parser.add_argument('--model', choices=['deepseek-chat', 'deepseek-reasoner'], 
                        default='deepseek-chat', help='Model to estimate costs for')
    parser.add_argument('--time', choices=['standard', 'discount'], 
                        default='standard', help='Time period for pricing (standard: UTC 00:30-16:30, discount: UTC 16:30-00:30)')
    parser.add_argument('--json', action='store_true', help='Output in JSON format')
    
    args = parser.parse_args()
    
    if args.file:
        token_count = count_tokens_from_file(args.file)
    else:
        token_count = count_tokens_simple(args.text)
    
    cost_estimate = estimate_cost(token_count, args.model, args.time)
    
    if args.json:
        print(json.dumps(cost_estimate, indent=2))
    else:
        print(f"\nToken Count Estimate: {token_count}")
        print(f"Model: {args.model}")
        print(f"Time Period: {args.time}")
        print("\nEstimated Costs (USD):")
        print(f"  Input (Cache Hit): ${cost_estimate['costs']['input_cache_hit']:.6f}")
        print(f"  Input (Cache Miss): ${cost_estimate['costs']['input_cache_miss']:.6f}")
        print(f"  Output (Same Length): ${cost_estimate['costs']['output_same_length']:.6f}")
        print("\nTotal Costs:")
        print(f"  With Cache Hit: ${cost_estimate['costs']['total_cache_hit']:.6f}")
        print(f"  With Cache Miss: ${cost_estimate['costs']['total_cache_miss']:.6f}")

if __name__ == "__main__":
    main()
