import { requiredEnv } from "@/lib/env";

type GraphQLError = { message: string };

export async function wpGraphQL<TData>(
  query: string,
  variables?: Record<string, unknown>
): Promise<TData> {
  const endpoint = requiredEnv("WPGRAPHQL_URL");

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      // Optional: set a UA to help hosts/caches differentiate requests.
      "user-agent": "newsroom-nextjs/1.0",
    },
    body: JSON.stringify({ query, variables }),
    // REAL-TIME: always hit WordPress, never Next.js cache.
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WPGraphQL HTTP ${res.status}: ${text.slice(0, 500)}`);
  }

  const json = (await res.json()) as { data?: TData; errors?: GraphQLError[] };

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("\n"));
  }

  if (!json.data) throw new Error("WPGraphQL: Missing data");
  return json.data;
}
