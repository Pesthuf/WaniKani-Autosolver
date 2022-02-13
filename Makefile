MAKEFLAGS += --no-builtin-rules

.PHONY: all run
all: WaniKani-Autosolver run

run:
	deno run --allow-net --allow-read index.ts

WaniKani-Autosolver: index.ts $(wildcard lib/*)
	deno compile --allow-net --allow-read --target x86_64-unknown-linux-gnu index.ts