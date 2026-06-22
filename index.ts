#!/usr/bin/env bun

type history = {
  role: string;
  content: string;
};
let history: history[] = [];
let modelName: string = "";
let modelNameSaid: boolean;
async function main() {
  if (!apiKeyCheck()) {
    console.log("Env key not set.");
    return;
  }
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.log("Env key not set.");
    throw new Error("Missing GROQ_API_KEY in environment");
  }
  const args = process.argv.slice(2);
  const query = args.join(" ");

  const response = await getAiResponse(query, apiKey);
  if (args.length === 0) {
    const response = await getAiResponse(query, apiKey);
  }
  if (response) {
  }
  // console.log("[HISTORY]", history)
}

type GroqResponse = {
  choices: {
    message: {
      content: string;
    };
  }[];
  model: string;
};

async function getAiResponse(message: string, apiKey: string): Promise<string> {
  history.push({ role: "user", content: message });
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        stream: true,
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are a fast AI assistant. Reply in 1-2 short sentences unless the user asks for detail. Prioritize direct answers over explanations.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    },
  );

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  // const decorder = new TextDecoder()
  // // console.log(decorder.decode(chunk.value))
  // const chunk = await reader.read()
  const decoder = new TextDecoder();
  const messageConstruct: string[] = [];
  while (true) {
    const chunk = await reader.read();
    const text = decoder.decode(chunk.value);
    const line = text.split("\n");
    for (let l of line) {
      if (!l.startsWith("data: ")) {
        continue;
      } else if (l === "data: [DONE]") {
        if (!modelNameSaid) {
          console.log(chalk.dim(" : " + modelName));
          modelNameSaid = true;
        }
      }

      try {
        const parsed = JSON.parse(l.slice(6));

        modelName = parsed.model;

        const textChunk = parsed.choices[0]?.delta?.content ?? "";
        process.stdout.write(chalk.white(textChunk));
        messageConstruct.push(textChunk);
      } catch {}
    }
    if (chunk.done) {
      break;
    }
  }
  const fullMessage = messageConstruct.join(" ");
  history.push({ role: "assistant", content: fullMessage });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return fullMessage;
}

main();
function apiKeyCheck() {
  const apiKey = process.env.GROQ_API_KEY;
  if (apiKey) {
    return true;
  }
  checkConfigFileExists();
  return false;
}
function checkConfigFileExists() {}
