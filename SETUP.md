# AI Assistant Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up OpenAI API Key**
   - Create a `.env.local` file in the root directory
   - Add your OpenAI API key:
   ```
   NEXT_PUBLIC_OPENAI_API_KEY=your_actual_openai_api_key_here
   ```

3. **Get OpenAI API Key**
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Sign up or log in
   - Go to API Keys section
   - Create a new API key
   - Copy the key and paste it in your `.env.local` file

4. **Run the Application**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   - Go to `http://localhost:3000`
   - Start chatting with the AI!

## Features

- ✨ Clean, modern UI design
- 🚀 Real-time AI responses
- 💬 Message suggestions
- 📱 Responsive design
- ⚡ Fast and lightweight

## Troubleshooting

### AI Not Responding?
- Check that your OpenAI API key is correctly set in `.env.local`
- Make sure you have credits in your OpenAI account
- Verify your internet connection

### UI Issues?
- Clear your browser cache
- Make sure all dependencies are installed
- Check the browser console for errors

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- OpenAI API

## Support

If you encounter any issues, please check:
1. Your OpenAI API key is valid
2. You have sufficient credits in your OpenAI account
3. All dependencies are properly installed
4. The `.env.local` file is in the correct location
