sed -i 's/focus:border-emerald-500\/50/focus:border-upda-ciano\/50/' src/index.css
sed -i 's/focus:ring-emerald-500\/10/focus:ring-upda-ciano\/10/' src/index.css
sed -i 's/glow-emerald/glow-ciano/' src/index.css
sed -i 's/rgba(16, 185, 129, 0.1)/rgba(52, 168, 180, 0.1)/' src/index.css
sed -i 's/text-emerald-400/text-upda-ciano/' src/index.css
sed -i 's/text-emerald-500/text-upda-ciano/' src/index.css
sed -i 's/color: #059669/color: #1c3b45/' src/index.css
sed -i '/--font-serif: "Cormorant Garamond", serif;/a \
  --color-upda-petrolio: #1c3b45;\
  --color-upda-ciano: #34a8b4;' src/index.css
