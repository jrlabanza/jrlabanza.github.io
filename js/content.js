// Curated copy for the portfolio. Numbers, dates, stars and languages come from
// js/data.js (generated from the GitHub API); this file only holds the words.
window.PORTFOLIO_CONTENT = {
  hero: {
    intro:
      'Full-stack developer crafting web apps, tools for running a room, and a growing set of generative AI studios. All of it lives on GitHub.',
  },

  // Repositories shown as large tiles. `repo` must match a repository name.
  featured: [
    {
      repo: 'jrlabanza-image-generator-core',
      title: 'Jrlabanza Image Generator.',
      tagline: 'A one-person AI art studio.',
      body:
        'A React 19 Studio served by Stable Diffusion WebUI Forge Neo: one floating prompt bar, live preview while rendering, a Library that reads prompts back out of your output folder, Edit, Vary and Remix on every image, unattended Boards, and a Quick Select deck of around 4,900 toggleable chips. Underneath sit 18 tool pages, including Auto Pilot, Director and a LoRA trainer.',
      stack: ['Python', 'React 19', 'Vite', 'SDXL', 'Forge Neo'],
      visual: 'studio',
      wide: true,
      theme: 'dark',
    },
    {
      repo: 'bracket.gg',
      title: 'BRACKET.GG.',
      tagline: 'A tournament platform in one HTML file.',
      body:
        'Registration, seeding with byes, double-elimination brackets with grand-final reset, live set reporting and standings. It autosaves to the browser, exports JSON and needs no server.',
      stack: ['JavaScript', 'Single file', 'localStorage'],
      visual: 'bracket',
    },
    {
      repo: 'office-trivia-web-game',
      title: 'Online Trivia.',
      tagline: 'Kahoot-style multiplayer for your LAN.',
      body:
        'Players join from their phones with a six-digit PIN, answer timed questions for speed-based points and race for the podium. A built-in editor handles quizzes, images and music; a one-command Linux installer does the rest.',
      stack: ['Node.js', 'Multiplayer', 'systemd'],
      visual: 'trivia',
    },
    {
      repo: 'sd-prompt-enhancer',
      title: 'Prompt Enhancer.',
      tagline: 'Human choices in. Precise tags out.',
      body:
        'A guided prompt builder for Illustrious-XL and NoobAI on Forge. Pick pose, framing, outfit, scene and style from readable dropdowns, or upload a reference image and let a WD14 ViT-v3 tagger reverse-engineer it.',
      stack: ['Python', 'ONNX', 'Forge extension'],
      visual: 'prompt',
    },
    {
      repo: 'sd-lora-trainer',
      title: 'LoRA Trainer.',
      tagline: 'From a handful of images to a trained model.',
      body:
        'Drop 5 to 15 references, type a trigger word, pick a preset and a base SDXL checkpoint, press Start. Sandboxed kohya-ss scripts, automatic captioning and defaults tuned for 8 to 12 GB graphics cards.',
      stack: ['Python', 'PyTorch', 'SDXL'],
      visual: 'lora',
    },
  ],

  // Each repository belongs to one lane. Unlisted repositories are still shown
  // in the full list, just not in a lane.
  lanes: [
    {
      title: 'Generative AI.',
      body:
        'Extensions and studios for Stable Diffusion WebUI Forge Neo: prompt building, reference images, IP-Adapter fixes, LoRA training and an end-to-end image generator.',
      icon: 'sparkle',
      repos: [
        'jrlabanza-image-generator-core',
        'forge-neo-toolkit',
        'sd-prompt-enhancer',
        'sd-lora-trainer',
        'sd-reference-image',
        'sd-ipadapter-compat',
        'Tortoise-TTS-Training',
      ],
    },
    {
      title: 'Web apps.',
      body:
        'React and Next.js front ends, Node APIs and MySQL back ends, from first boilerplates to a production performance-plan system.',
      icon: 'layers',
      repos: [
        'PIPE',
        'simple-full-stack-react',
        'react-sql',
        'next-js-boilerplate',
        'memories-react-client',
        'memories-react-api',
        'myFirstReact',
        'angular_boilerplate',
        'jrlabanza.github.io',
      ],
    },
    {
      title: 'Games and events.',
      body:
        'Tools for running a room: tournament brackets, LAN trivia, a duck race, a wheel of names and a Pokémon battle simulator.',
      icon: 'trophy',
      repos: [
        'bracket.gg',
        'office-trivia-web-game',
        'duck-race',
        'wheel-of-names',
        'pokemonSim',
        'floppybird-group',
      ],
    },
  ],

  stack: [
    { group: 'Front end', items: ['React', 'Next.js', 'Vite', 'HTML', 'CSS', 'TypeScript'] },
    { group: 'Back end', items: ['Node.js', 'Python', 'MySQL', 'ASP.NET', 'C#'] },
    {
      group: 'Generative AI',
      items: ['Stable Diffusion', 'SDXL', 'LoRA', 'IP-Adapter', 'ONNX', 'PyTorch', 'CUDA'],
    },
    { group: 'Ops and tooling', items: ['Docker', 'PM2', 'systemd', 'Shell', 'PowerShell', 'Batch'] },
  ],

  // One line per year. Years without a line still render with their repositories.
  timeline: {
    2018: 'Joined GitHub.',
    2020: 'First React apps, a React, Node and MySQL template, and a Pokémon simulator built on ASP.NET.',
    2021: 'The Memories app, split into a React client and a Node API, plus a Next.js starter.',
    2022: 'PIPE, a React-based performance improvement plan system, and an Angular starter.',
    2023: 'A group fork of Floppy Bird.',
    2024: 'A static site published on GitHub Pages.',
    2025: 'Exploring voice model training with a Tortoise TTS fork.',
    2026: 'The generative AI year: six Forge Neo extensions, a complete image studio, LAN trivia, a tournament platform and party tools.',
  },

  // Fallback descriptions for repositories that have none on GitHub.
  descriptions: {
    'jrlabanza-image-generator-core':
      'A one-person AI art studio built on Stable Diffusion WebUI Forge Neo.',
    'forge-neo-toolkit':
      'Sixteen custom Forge Neo extensions covering describe, generate, judge, curate, fix and finalize.',
    'office-trivia-web-game':
      'Self-hosted, Kahoot-style multiplayer trivia for your local network.',
    'sd-prompt-enhancer':
      'Guided prompt builder and reference-image tagger for Illustrious-XL and NoobAI on Forge.',
    'sd-lora-trainer':
      'One-click SDXL LoRA training tab for Forge Neo, powered by sandboxed kohya-ss scripts.',
    'sd-reference-image':
      'NovelAI-style Vibe Transfer and Precise Reference inside the txt2img tab, via IP-Adapter.',
    'sd-ipadapter-compat':
      'Makes IP-Adapter work on Forge Neo without giving up SageAttention 2 speed.',
    'jrlabanza.github.io': 'Static site hosted on GitHub Pages.',
    'memories-react-client': 'React client for the Memories app.',
    'memories-react-api': 'Node API for the Memories app.',
    'next-js-boilerplate': 'Next.js starter bootstrapped with create-next-app.',
  },
};
