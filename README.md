# Nest GPT

## Instalacion

Clone the repository

Install dependencies: 
```bash
npm install
```

Create an ```.env``` file at the root level of the project based off the ```.env.template``` file

Run: 
```bash
npm run start:dev
```

The api will be avilable at http://localhost:3000

## Current endpoints

```bash
gpt/orthography-check
```

Should return:
```bash
{
  "prompt": "your prompt text",
  "apiKey": "your openai key"
}
```