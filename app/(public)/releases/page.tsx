import React from "react";

type Release = {
  name: string;
  tag_name: string;
  body: string;
  published_at: string;
  html_url: string;
};

type RepoReleases = {
  repoName: string;
  releases: Release[];
};

export default async function ReleasesPage() {
  const repositories = [
    { owner: "HeapReaper", repo: "Orbit" },
    { owner: "HeapReaper", repo: "Orbit-bot" },
  ];

  const repos: RepoReleases[] = await Promise.all(
    repositories.map(async ({ owner, repo }) => {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/releases`,
        { next: { revalidate: 600 } }
      );
      const data: Release[] = await res.json();

      return {
        repoName: repo,
        releases: data.slice(0, 3),
      };
    })
  );

  return (
    <main className="min-h-screen bg-[#0d0f13] text-gray-300 px-6 md:px-20 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
          Releases
        </h1>

        {repos.map(({ repoName, releases }) => (
          <div key={repoName} style={{ marginBottom: "3rem" }}>
            <h3 className="text-3xl font-bold mb-1">{repoName}</h3>

            {releases.map((release) => (
              <div key={release.tag_name} style={{ marginBottom: "2rem" }}>
                <h3>
                  <a
                    href={release.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-bold pb-2"
                  >
                    {release.name} ({release.tag_name})
                  </a>
                </h3>
                <p className="mt-1">{new Date(release.published_at).toLocaleDateString()}</p>
                <ul className="list-disc list-inside mt-2">
                  {release.body
                    .split("\n")
                    .map((line) => line.trim())  // remove extra spaces
                    .filter((line) => line.length > 0)  // skip empty lines
                    .map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
