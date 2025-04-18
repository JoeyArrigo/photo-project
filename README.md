# photo-project
## motivations
- I want to learn more about ollama (https://github.com/ollama), and working with llm's in general
- I moved recently and have a lot of old photos around and want a way to know what's where
- I think I could learn a lot by building a project that keeps track of different information associated with the photos like:
	- people 
	- description
	- date
	- places
	- physical location of analog photo (album/page, box/index, etc.)
	- file path
	- etc.
## next steps
- see `doc/rodamap.md` and `doc/tasks.md`
## repo structure
```
photo-organizer/
├── services/
│   ├── processor/         # Python-based media processing service
│   │   ├── src/           # Python source code
│   │   ├── tests/         # Python tests
│   │   ├── requirements.txt
│   │   ├── setup.py
│   │   └── Dockerfile     # For containerization if needed
│   │
│   └── api/               # TypeScript/Node.js API service
│       ├── src/           # TS source code
│       ├── tests/         # TS tests
│       ├── package.json
│       └── tsconfig.json
│
├── web/                   # React/Next.js/etc. frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── packages/              # Shared TypeScript packages
│   ├── db/                # Database client and models
│   └── ui/                # Shared UI components
│
├── scripts/               # Shared scripts for dev operations
│   ├── setup.sh           # Environment setup
│   └── dev.sh             # Development helpers
│
├── .github/               # CI/CD workflows if using GitHub
├── docs/                  # Documentation
├── package.json           # Root package.json for JS components
├── pyproject.toml         # Python project config (optional)
└── README.md              # Project overview
```

