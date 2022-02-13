MAKEFLAGS += --no-builtin-rules

.PHONY: all run

run:
	deno run --allow-net --allow-read index.ts

all: WaniKani-Autosolver WaniKani-Autosolver.exe

WaniKani-Autosolver: index.ts $(wildcard lib/*)
	deno compile --allow-net --allow-read --target x86_64-unknown-linux-gnu index.ts

WaniKani-Autosolver.exe: index.ts $(wildcard lib/*)
	deno compile --allow-net --allow-read --target x86_64-pc-windows-msvc index.ts