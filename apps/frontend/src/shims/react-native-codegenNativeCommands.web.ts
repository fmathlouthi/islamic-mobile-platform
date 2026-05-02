type CommandConfig = Record<string, unknown>;

export default function codegenNativeCommands<T extends CommandConfig>(
  _options: T
): (..._args: unknown[]) => void {
  return () => {};
}
