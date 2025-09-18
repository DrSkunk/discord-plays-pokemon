# Discord Plays Pokémon

Discord Plays Pokémon is a TypeScript Node.js application that enables a Discord server to collectively play Game Boy games through text channel interactions. The bot displays game frames and processes reactions as controller inputs.

Always reference these instructions first and only fallback to search or bash commands when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Dependencies
- Install system dependencies for canvas: `sudo apt-get update && sudo apt-get install -y libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev libpixman-1-dev build-essential`
- Install Node.js dependencies: `npm install` -- takes 45-60 seconds, NEVER CANCEL. Set timeout to 180+ seconds.
- **CRITICAL**: If canvas installation fails with Node.js compatibility issues, upgrade canvas: `npm install canvas@^2.11.2 --save`

### Build and Development
- Build TypeScript: `npm run build` -- takes 2-3 seconds
- Development mode: `npm run develop` -- uses nodemon for auto-reload
- Start production: `npm start` -- compiles then starts application
- **NOTE**: Application requires valid .env configuration and GameBoy ROM file to fully start

### Code Quality
- Lint code: `npm run lint` -- takes 3-5 seconds, may show warnings about legacy code
- Format code: `npm run prettier-format` -- takes 2-3 seconds
- **ALWAYS** run `npm run lint` and `npm run prettier-format` before committing changes

### Testing and Validation
- **NO UNIT TESTS**: Repository has `"test": "echo \"Error: no test specified\" && exit 1"` - testing is manual only
- **MANUAL VALIDATION REQUIRED**: After code changes, validate by:
  1. Creating test .env file: `cp .env.example .env`
  2. Adding dummy ROM: `mkdir -p roms && echo "dummy" > roms/test.gb`
  3. Testing startup: `timeout 10s npm start` (should fail gracefully with "ROM image size too small")
  4. Verify web interface available at http://localhost:2020 when running

## Configuration and Setup

### Environment Configuration
- Copy `.env.example` to `.env` and configure:
  - `DISCORD_TOKEN`: Discord bot token from Discord Developer Portal
  - `DISCORD_GUILD_ID` and `DISCORD_CHANNEL_ID`: Enable Discord developer mode to copy IDs
  - `ROMFILE`: Place GameBoy ROM in `/roms` directory, set filename here
  - `MODE`: "ANARCHY" (first reaction wins) or "DEMOCRACY" (vote-based)
  - `WEB_PORT`: Debug web interface port (default 2020)
  - `SCALE`: Image scale 1-6 for Discord output (3 recommended max)

### Required Files
- **GameBoy ROM**: Must be placed in `/roms` directory with filename matching `ROMFILE` env var
- **Canvas Dependencies**: System libraries required for image processing (see bootstrap section)

## Codebase Navigation

### Key Components
- `src/index.ts`: Main application entry point, orchestrates all components
- `src/DiscordClient.ts`: Discord bot integration and message handling
- `src/GameboyClient.ts`: GameBoy emulator wrapper using serverboy library
- `src/commands/`: Discord command implementations (Help, Info, Map, etc.)
- `src/SocketServer.ts`: WebSocket server for debug web interface
- `src/Gifmaker.ts`: Creates summary GIFs every 2 hours via cron

### Important Directories
- `dist/`: TypeScript compilation output (auto-generated)
- `roms/`: GameBoy ROM files (*.gb files gitignored)
- `saves/`: Game save states (*.sav files gitignored)
- `frames/`: Screenshot frames for GIF generation (*.png files gitignored)
- `debug/`: Web interface HTML for manual testing

### Configuration Files
- `tsconfig.json`: TypeScript compilation settings
- `.eslintrc.js`: ESLint configuration with TypeScript and Prettier rules
- `.prettierrc`: Code formatting configuration
- `Dockerfile`: Container build instructions (Node.js LTS)

## Development Workflows

### Adding New Discord Commands
1. Create new file in `src/commands/` following existing patterns
2. Implement `Command` interface with `names`, `description`, `execute`, `adminOnly`
3. Export as `command` object
4. Command auto-discovery handles registration

### Testing Changes
1. **CRITICAL**: Always test after canvas or system dependency changes:
   - Remove node_modules: `rm -rf node_modules`
   - Reinstall: `npm install` (180+ second timeout)
   - Verify build: `npm run build`
2. **WEB INTERFACE**: Start application and test http://localhost:2020 for real-time game view
3. **VALIDATE**: Test Discord commands with `.env` configuration

### Common Issues and Solutions
- **Canvas compilation failures**: Update to canvas@^2.11.2 or install system dependencies
- **Discord.js deprecation warnings**: Expected behavior, legacy version required for compatibility
- **ROM size errors**: Need actual GameBoy ROM file, not dummy content
- **WebSocket connection issues**: Ensure WEB_PORT is available and not blocked

## Build Times and Expectations
- `npm install`: 45-60 seconds (first time), 180+ seconds with canvas compilation
- `npm run build`: 2-3 seconds
- `npm run lint`: 3-5 seconds  
- `npm run prettier-format`: 2-3 seconds
- Application startup: Immediate if properly configured

## Validation Scenarios
After making changes, validate:
1. **Build Process**: `npm run build` succeeds without errors
2. **Code Quality**: `npm run lint` and `npm run prettier-format` run clean
3. **Application Startup**: Test with dummy .env and verify graceful error handling
4. **Web Interface**: Access debug interface at configured WEB_PORT
5. **Command Processing**: If Discord integration changes, test command recognition

## Container Development
- Use `Dockerfile` for consistent environment with Node.js LTS
- Container includes all system dependencies for canvas
- Build with: `docker build -t discord-plays-pokemon .`
- **NEVER CANCEL**: Docker build takes 3-5 minutes

## Critical Reminders
- **NEVER CANCEL** long-running commands - builds may take several minutes
- **ALWAYS** install system dependencies before npm install if canvas fails
- **MANUAL TESTING REQUIRED** - no automated test suite exists
- **VALIDATE FULLY** - test build, lint, startup, and web interface after changes
- **ROM REQUIRED** - application needs valid GameBoy ROM file to function completely