[...existing Midscene.js and Ultra Plan content...]

## Local AI Setup

To run local VLM/LLM (UI-TARS via vLLM):

1. Ensure you have a GPU with 8GB+ VRAM.
2. Install vllm (pip install vllm>=0.6.1).
3. Download model: ByteDance/UI-TARS-7B-DPO from Hugging Face to ./models/ui-tars-7b.
4. Start vLLM server:
   ```
   python3 -m vllm.entrypoints.openai.api_server \
     --model ./models/ui-tars-7b \
     --served-model-name ui-tars \
     --port 8000 \
     --tensor-parallel-size 1 \
     --max-num-batched-tokens 8192 \
     --enable-openai-api
   ```
5. Endpoint: `http://127.0.0.1:8000/v1`
6. Your `.env.agent.template` is pre-filled for this config.

If local GPU is not available, populate `.env.agent.template` with your OpenRouter key and free-tier model ID. The agent will fallback automatically.