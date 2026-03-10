## Installation

1. Clone the repository:
```bash
git clone https://github.com/millsjpw/gator.git
cd gator
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Install globally (optional):
```bash
npm install -g .
```

5. Set up the config file (`~/.gatorconfig.json`):
```json
{
    "db_url": "<database_connection_string>",
    "current_user_name": ""
}
```

6. Run database migrations:
```bash
npm run migrate
npm run push
```

## Usage

Run the CLI with:
```
npm run start [command]
```

### Commands

| Command | Description |
|---------|-------------|
| `login <name>` | Log in the user matching the given name |
| `register <name>` | Register a new user with the given name |
| `reset` | Clear all users from the database |
| `agg` | Scrape RSS feeds to find new posts and save to DB |
| `addfeed <feed name> <feed url>` | Add a feed to the database |
| `feeds` | List all saved feeds |
| `follow <feed url>` | Follow a specific saved feed |
| `following` | List all feeds the user is following |
| `unfollow <feed url>` | Unfollow a specific saved feed |
| `browse [number of posts]` | List aggregated posts (default: 2) |

