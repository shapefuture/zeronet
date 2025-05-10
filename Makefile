# Ultra-Low-Latency Web: Server/CI-Only Makefile

install:
	pnpm install --no-frozen-lockfile

build:
	pnpm build

test:
	pnpm test

lint:
	pnpm lint

e2e:
	pnpm --filter web-app test:e2e

render-api:
	cd apps/render-api && uvicorn main:app --reload --host 0.0.0.0 --port 8000

web-app:
	pnpm --filter web-app dev -- --port 3000

llm-download:
	mkdir -p models/ui-tars-7b && \
	curl -L -o models/ui-tars-7b/pytorch_model.bin "https://huggingface.co/ByteDance/UI-TARS-7B-DPO/resolve/main/pytorch_model.bin"

llm-server:
	pip install vllm==0.6.1
	python3 -m vllm.entrypoints.openai.api_server \
		--model ./models/ui-tars-7b \
		--served-model-name ui-tars \
		--port 9000 \
		--enable-openai-api

storybook:
	pnpm --filter web-app storybook

ci:
	make install
	make build
	make test
	make lint
	make e2e
