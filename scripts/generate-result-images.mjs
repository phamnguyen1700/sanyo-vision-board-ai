import { mkdir, writeFile } from "node:fs/promises";

const outputDir = "public/image-pool-demo-v2";
const jobs = [
  ["result-male-q2.png", "Vietnamese young adult man celebrating a career promotion and higher salary in a modern office, confident professional, subtle laptop and city skyline, polished daylight, realistic lifestyle photography, square composition, no text, no logos, no watermark."],
  ["result-male-q3.png", "Vietnamese young adult man spending quality time with close friends at a relaxed outdoor gathering, genuine laughter and friendship, warm candid lifestyle photography, bright natural light, square composition, no text, no logos, no watermark."],
  ["result-male-q4.png", "Vietnamese young adult man exploring Japan, walking through Kyoto with traditional Japanese architecture, matcha tea house details and a small travel bag, clear Japan travel atmosphere, realistic lifestyle photography, square composition, no text, no logos, no watermark."],
  ["result-male-q5.png", "Vietnamese young adult man learning multiple foreign languages at a bright study desk, language books and flashcards, focused and optimistic, realistic lifestyle photography, square composition, no readable text, no logos, no watermark."],
  ["result-female-q2.png", "Vietnamese young adult woman celebrating passing university entrance with her family, books nearby, warm supportive smiles, realistic lifestyle photography, bright natural light, square composition, no text, no logos, no watermark."],
  ["result-female-q3.png", "Vietnamese young adult woman sharing a joyful romantic moment with her partner in a warm everyday setting, natural affection, realistic lifestyle photography, soft daylight, square composition, no text, no logos, no watermark."],
  ["result-female-q4.png", "Vietnamese young adult woman traveling through Europe, standing in a beautiful historic European city square with elegant architecture, joyful discovery, realistic lifestyle photography, golden daylight, square composition, no text, no logos, no watermark."],
  ["result-female-q5.png", "Vietnamese young adult woman learning to bake in a bright home kitchen, pastries, mixing bowl and ingredients visible, creative joyful expression, realistic lifestyle photography, square composition, no text, no logos, no watermark."]
];

const key = process.env.OPENAI_API_KEY;
if (!key) throw new Error("OPENAI_API_KEY is required");
await mkdir(outputDir, { recursive: true });

for (const [filename, prompt] of jobs) {
  console.log(`Generating ${filename}...`);
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-2", prompt, size: "1024x1024", quality: "medium", output_format: "png" })
  });
  const body = await response.json();
  if (!response.ok) throw new Error(`${filename}: ${response.status} ${body?.error?.message ?? "Image generation failed"}`);
  const item = body.data?.[0];
  if (item?.b64_json) await writeFile(`${outputDir}/${filename}`, Buffer.from(item.b64_json, "base64"));
  else if (item?.url) await writeFile(`${outputDir}/${filename}`, Buffer.from(await (await fetch(item.url)).arrayBuffer()));
  else throw new Error(`${filename}: no image returned`);
}

console.log(`Saved ${jobs.length} images to ${outputDir}`);
