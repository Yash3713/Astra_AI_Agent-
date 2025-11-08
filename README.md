# Astra AI Agent

An intelligent weather agent powered by OpenAI that fetches weather information for specified cities and automatically sends the results via email.

## Features

- Fetch real-time weather data for any city
- Automatically email weather reports to specified recipients
- Built-in error handling for robust operations
- XSS protection for secure email content
- Configurable queries via command-line arguments

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm package manager
- [Resend](https://resend.com) API key for email delivery
- [OpenAI](https://openai.com) API key for agent functionality

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Astra_AI_Agent-
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and add your API keys:
```env
RESEND_API_KEY=your_actual_resend_api_key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_TO=recipient@example.com
OPENAI_API_KEY=your_actual_openai_api_key
```

## Usage

### Default Query

Run the agent with the default query (Chennai weather):
```bash
npm run dev
```

### Custom Query

Pass a custom query via command-line arguments:
```bash
node index.js "Get the weather in Tokyo, Paris, and New York, then email me the results."
```

### Example Queries

```bash
# Single city
node index.js "Get the weather in London and email me"

# Multiple cities
node index.js "Check weather for Mumbai, Delhi, and Bangalore then send email"

# With specific instructions
node index.js "Get current weather for San Francisco and Los Angeles, format nicely and email"
```

## Project Structure

```
Astra_AI_Agent-/
├── .env.example          # Environment variable template
├── .gitignore            # Git ignore rules
├── README.md             # This file
├── package.json          # Project dependencies
├── index.js              # Main application code
└── WeatherEmail.jsx      # (Optional) React Email template
```

## How It Works

1. **Weather Tool**: Fetches weather data from [wttr.in](https://wttr.in) API
2. **Email Tool**: Sends formatted weather reports via Resend
3. **AI Agent**: Orchestrates the tools to complete user requests
4. **Error Handling**: Gracefully handles API failures and network issues

## Security Features

- Environment variable validation on startup
- XSS protection via HTML escaping
- Request timeouts to prevent hanging
- Comprehensive error logging

## API Rate Limits

- **wttr.in**: Free tier has no official limits but please use responsibly
- **Resend**: Check your plan's email sending limits
- **OpenAI**: Depends on your API plan and model usage

## Troubleshooting

### "Missing required environment variables" error
Make sure all variables in `.env` are set correctly.

### Email not sending
- Verify your Resend API key is valid
- Check that `EMAIL_FROM` domain is verified in Resend
- Ensure `EMAIL_TO` is a valid email address

### Weather data not fetching
- Check your internet connection
- The wttr.in service might be temporarily unavailable
- Try with a different city name

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Author

Your Name

---

Built with [OpenAI Agents SDK](https://github.com/openai/openai-agents-sdk), [Resend](https://resend.com), and [wttr.in](https://wttr.in)
