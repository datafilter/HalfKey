#!/bin/zsh
echo "Type in salt, then press ENTER"
read -r salt
echo "Type in pepper, then press ENTER"
read -s -r pepper
saltHash=$(echo -n "$salt" | openssl dgst -sha256)
pepperHash=$(echo -n "$pepper" | openssl dgst -sha256)
hashHash=$(echo -n "$saltHash$pepperHash" | openssl dgst -sha256)
echo "Type in subset-length, or/then press ENTER [8]"
read -r sublen
sublen=${sublen:-8}
subset=$(echo -n "$hashHash" | head -c "$sublen")

printf "%s\n" "modifier pasted to clipboard: $subset"
echo -n "$subset" | pbcopy
