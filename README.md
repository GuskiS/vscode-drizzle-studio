# VSCode Drizzle Studio

VSCode extension to seamlessly integrate and manage your Drizzle ORM projects with Drizzle Studio. This extension helps you quickly launch and interact with Drizzle Studio directly from your VS Code workspace.

## Requirements

- **Drizzle Kit**: Make sure `drizzle-kit` is installed as a development dependency in your project (`npm install drizzle-kit --save-dev`).
- **`drizzle.config.ts`**: Your project must have a `drizzle.config.ts` file at the root of your workspace for the automatic launch to work.

## Usage

1.  **Open a Drizzle Project**: Open a VS Code workspace that contains a `drizzle.config.ts` file at its root. The extension will automatically detect this and start the Drizzle Studio process in the background.

2.  **Open Drizzle Studio Panel**:
    - Click button in bottom-left corner
    - Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and select `Drizzle Studio: Open`.
