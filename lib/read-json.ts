export async function readJson(req: Request): Promise<Record<string, any> | null> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}
