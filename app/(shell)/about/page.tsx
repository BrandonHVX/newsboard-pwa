import type { Metadata } from "next";
import { wpGraphQL } from "@/lib/wpgraphql";
import { Q } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "About",
  description: "About Heavy Status — who we are, our mission, editorial team, and how to contact us.",
  alternates: { canonical: "/about" },
};

type Author = {
  name: string;
  slug: string;
  description: string;
  avatar?: { url?: string } | null;
};

async function getAuthors(): Promise<Author[]> {
  try {
    const data = await wpGraphQL<{ users: { nodes: Author[] } }>(Q.AUTHORS);
    return data.users.nodes.filter((a) => a.name && a.name !== "admin");
  } catch {
    return [];
  }
}

export default async function AboutPage() {
  const authors = await getAuthors();

  return (
    <article className="mx-auto max-w-3xl px-4 md:px-6">
      <h1 className="font-serif text-[34px] leading-[1.02] tracking-[-0.03em]">About Heavy Status</h1>

      <div className="prose prose-slate max-w-none mt-8 prose-headings:font-serif prose-a:underline prose-a:underline-offset-4">
        <section>
          <h2>Our Mission</h2>
          <p>
            Heavy Status is a digital news publication dedicated to delivering timely, accurate, and original
            reporting on the stories that matter most. We cover breaking news, live events, and in-depth
            analysis across a wide range of topics — from current affairs and culture to business and technology.
          </p>
        </section>

        <section>
          <h2>What We Do</h2>
          <p>
            Our editorial team works around the clock to bring you up-to-the-minute coverage. Every article
            published on Heavy Status is original journalism, adhering to the highest standards of accuracy,
            fairness, and transparency. We do not publish rewritten, scraped, or AI-generated content
            without clear editorial oversight and disclosure.
          </p>
        </section>

        <section>
          <h2>Editorial Standards</h2>
          <ul>
            <li><strong>Accuracy</strong> — We fact-check all stories before publication and issue corrections promptly when errors are identified.</li>
            <li><strong>Originality</strong> — Our content is original reporting. We clearly attribute sources and link to primary documents whenever possible.</li>
            <li><strong>Transparency</strong> — We distinguish between news reporting and opinion. Sponsored content is clearly labeled.</li>
            <li><strong>Independence</strong> — Our editorial decisions are made independently of commercial or political interests.</li>
          </ul>
        </section>
      </div>

      <section className="mt-12">
        <h2 className="font-serif text-2xl mb-6">Our Team</h2>
        <p className="text-muted mb-8">
          Heavy Status is produced by a dedicated team of journalists, editors, and digital media
          professionals committed to delivering quality news coverage.
        </p>

        {authors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {authors.map((author) => (
              <div key={author.slug} className="flex gap-4 p-4 rounded-2xl border border-border-light bg-bg-secondary">
                {author.avatar?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={author.avatar.url}
                    alt={author.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent font-serif text-2xl font-medium">
                      {author.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold text-base">{author.name}</h3>
                  {author.description ? (
                    <p className="text-sm text-muted mt-1 line-clamp-3">{author.description}</p>
                  ) : (
                    <p className="text-sm text-muted mt-1">Contributor at Heavy Status</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-2xl border border-border-light bg-bg-secondary">
            <h3 className="font-semibold">Editorial Team</h3>
            <p className="text-sm text-muted mt-1">
              Our reporters and contributors bring diverse expertise across politics, technology,
              business, culture, and sports.
            </p>
          </div>
        )}

        <p className="text-sm text-muted mt-6">
          Interested in contributing? Reach out to us at{" "}
          <a href="mailto:contact@heavy-status.com" className="underline underline-offset-4 hover:text-black transition-colors">
            contact@heavy-status.com
          </a>.
        </p>
      </section>

      <div className="prose prose-slate max-w-none mt-12 prose-headings:font-serif prose-a:underline prose-a:underline-offset-4">
        <section>
          <h2>Contact Us</h2>
          <p>
            We welcome tips, feedback, and corrections. You can reach our editorial team at:
          </p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:contact@heavy-status.com">contact@heavy-status.com</a></li>
            <li><strong>Website:</strong> <a href="https://heavy-status.com">heavy-status.com</a></li>
          </ul>
        </section>

        <section>
          <h2>About This Platform</h2>
          <p>
            Heavy Status is built on modern web technology, delivering a fast, mobile-first reading experience.
            Our platform is available as a Progressive Web App (PWA) that you can install on your device for
            instant access to the latest news, even with limited connectivity.
          </p>
        </section>
      </div>
    </article>
  );
}
