"""Populate DevAtlas with realistic demo categories, authors, and articles.

Run from the backend/ directory with the venv active:

    python seed_data.py

Safe to re-run — categories/users/posts that already exist are skipped.
"""
import asyncio

from fastapi import HTTPException

from app.config import db
from app.model import PostStatus
from app.repository.category import CategoryRepository
from app.repository.post import PostRepository
from app.repository.users import UsersRepository
from app.schema import PostCreate, ProfileUpdateSchema, RegisterSchema
from app.service.auth_service import AuthService
from app.service.category import CategoryService
from app.service.post import PostService
from app.service.users import UserService

CATEGORIES = [
    ("Frontend", "UI engineering, frameworks, and the craft of building interfaces."),
    ("Backend", "APIs, databases, and the systems that power modern apps."),
    ("React", "Patterns, hooks, and best practices for the React ecosystem."),
    ("Next.js", "Server-side rendering, routing, and full-stack React."),
    ("Node.js", "Building fast, scalable JavaScript on the server."),
    ("Laravel", "Elegant PHP for modern web applications."),
    ("AI", "Machine learning, LLMs, and applied artificial intelligence."),
    ("Cloud", "Infrastructure, deployment, and cloud-native architecture."),
    ("DevOps", "CI/CD, automation, and operational excellence."),
    ("Career", "Growth, interviews, and navigating a developer career."),
    ("Open Source", "Contributing to and maintaining open-source software."),
]

AUTHORS = [
    {
        "username": "sarahchen",
        "email": "sarah@devatlas.dev",
        "name": "Sarah Chen",
        "phone_number": "0917-2200-1001",
        "birth": "12-03-1994",
        "sex": "FEMALE",
        "bio": "Frontend engineer focused on design systems and React performance. Previously at two YC startups.",
        "social_github": "https://github.com/sarahchen",
        "social_linkedin": "https://linkedin.com/in/sarahchen",
        "social_twitter": "https://x.com/sarahchendev",
    },
    {
        "username": "marcusobrien",
        "email": "marcus@devatlas.dev",
        "name": "Marcus O'Brien",
        "phone_number": "0917-2200-1002",
        "birth": "05-07-1990",
        "sex": "MALE",
        "bio": "Backend engineer building APIs at scale. Node.js, PHP, and everything in between.",
        "social_github": "https://github.com/marcusobrien",
        "social_website": "https://marcusobrien.dev",
    },
    {
        "username": "priyapatel",
        "email": "priya@devatlas.dev",
        "name": "Priya Patel",
        "phone_number": "0917-2200-1003",
        "birth": "21-11-1996",
        "sex": "FEMALE",
        "bio": "ML engineer working on applied AI. Writes about prompt engineering and open source.",
        "social_github": "https://github.com/priyapatel",
        "social_linkedin": "https://linkedin.com/in/priyapatel",
    },
    {
        "username": "jameskim",
        "email": "james@devatlas.dev",
        "name": "James Kim",
        "phone_number": "0917-2200-1004",
        "birth": "30-01-1992",
        "sex": "MALE",
        "bio": "DevOps engineer obsessed with reliability and cost-efficient cloud infrastructure.",
        "social_github": "https://github.com/jameskim",
        "social_website": "https://jameskim.io",
    },
]

PASSWORD = "DevAtlas2026!"

POSTS = [
    {
        "author": "sarahchen",
        "category": "React",
        "featured": True,
        "title": "10 React Hooks Patterns Every Developer Should Know",
        "excerpt": "From useMemo pitfalls to custom hooks that actually reduce complexity — patterns worth learning once and reusing forever.",
        "content": """## Why hooks patterns matter

Hooks changed how we write React, but most teams only scratch the surface of `useState` and `useEffect`. The patterns below are the ones that consistently show up in production codebases that scale well.

## 1. Extract logic into custom hooks

If a component has more than one `useEffect`, ask whether that logic belongs in a custom hook instead:

```jsx
function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}
```

This keeps components focused on rendering, not orchestration.

## 2. Don't reach for useMemo too early

`useMemo` has a cost too — it still runs on every render, it just skips recomputation. Only use it when the computation is measurably expensive or the reference identity matters (e.g. as a dependency elsewhere).

## 3. Colocate related state

Instead of five separate `useState` calls that always change together, group them into one object or reach for `useReducer`. It communicates intent and reduces the chance of stale updates.

## Closing thoughts

None of these patterns are exotic — they're just disciplined defaults. Apply them consistently and your components stay easy to reason about as the codebase grows.
""",
    },
    {
        "author": "marcusobrien",
        "category": "Backend",
        "title": "Building Type-Safe APIs with FastAPI and Pydantic",
        "excerpt": "FastAPI's real superpower isn't speed — it's how Pydantic turns your API contract into something the compiler (and your editor) can actually check.",
        "content": """## The contract problem

Most API bugs aren't logic bugs — they're contract mismatches. The frontend expects a field that the backend renamed, or a number where a string shows up. FastAPI plus Pydantic closes that gap at the framework level.

## Define the shape once

```python
from pydantic import BaseModel

class ArticleCreate(BaseModel):
    title: str
    excerpt: str
    category_id: str
```

This model is simultaneously your request validator, your OpenAPI schema, and your editor's autocomplete source.

## Validate at the boundary, trust everywhere else

Once a request passes through a Pydantic model, the rest of your service layer can trust the shape of that data completely. Stop re-checking types deep in your business logic — validate once, at the edge.

## Response models keep you honest too

Declaring a `response_model` prevents you from accidentally leaking internal fields (password hashes, internal IDs) in an API response. It's a contract in both directions.

## The payoff

Type-safety at the API boundary doesn't just prevent bugs — it makes the API self-documenting. New engineers can read the models and understand the contract without reading a single line of business logic.
""",
    },
    {
        "author": "sarahchen",
        "category": "Next.js",
        "title": "Understanding Server Components in Next.js 14",
        "excerpt": "Server Components aren't just 'SSR but nicer' — they change where your data-fetching, bundle size, and mental model live.",
        "content": """## A different default

In the App Router, every component is a Server Component unless you opt in to `"use client"`. That single default shift changes how you should think about data fetching.

## Fetch where you render

```jsx
async function ArticlePage({ params }) {
  const article = await getArticle(params.slug);
  return <Article data={article} />;
}
```

No `useEffect`, no loading spinner for the initial fetch, no client-side waterfall. The data is ready before the HTML ships.

## When you still need Client Components

Interactivity — state, event handlers, browser APIs — still needs `"use client"`. The trick is pushing that boundary as low in the tree as possible so the rest of the page stays server-rendered and light.

## Bundle size is the real win

Server Components never ship their code to the browser. Heavy dependencies (markdown parsers, date libraries) used only for server-side rendering cost you nothing on the client.

## Rethink, don't just port

Teams that get the most out of Server Components rethink their data-fetching architecture rather than just wrapping their old `useEffect` calls in an `async` function. Start with what truly needs interactivity, and work outward from there.
""",
    },
    {
        "author": "priyapatel",
        "category": "AI",
        "title": "A Practical Guide to Prompt Engineering for Developers",
        "excerpt": "Prompt engineering isn't magic incantations — it's applying the same rigor you'd apply to API design, just for natural language.",
        "content": """## Treat prompts like function signatures

A good prompt specifies inputs, constraints, and the shape of the expected output — the same discipline you'd bring to designing a function signature.

## Be explicit about format

```
Return a JSON object with exactly these keys: title, summary, tags.
Do not include any text outside the JSON object.
```

Ambiguity is the enemy. If you want structured output, say so explicitly and show an example.

## Few-shot examples beat long instructions

Two or three well-chosen examples often outperform a page of prose instructions. Models pattern-match on examples more reliably than they follow abstract rules.

## Iterate like you would with tests

Build a small set of representative test cases and re-run your prompt against them whenever you change it. Prompting without a regression set is like shipping code without tests.

## Know the limits

Prompt engineering can't fix a model that fundamentally lacks the knowledge or reasoning ability for a task. Know when the answer is a better prompt, and when it's a better model or a retrieval step.
""",
    },
    {
        "author": "jameskim",
        "category": "DevOps",
        "title": "Zero-Downtime Deployments with Docker and Kubernetes",
        "excerpt": "Rolling updates, readiness probes, and graceful shutdown — the pieces that actually make 'zero-downtime' true instead of aspirational.",
        "content": """## Zero-downtime is a checklist, not a feature flag

Kubernetes gives you rolling updates by default, but they only produce zero downtime if a few other things are true first.

## 1. Readiness probes must be honest

```yaml
readinessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 10
```

If `/healthz` returns healthy before your app can actually serve traffic (e.g. before a DB connection pool warms up), Kubernetes will route traffic to a pod that isn't ready.

## 2. Handle SIGTERM gracefully

When a pod is terminated, Kubernetes sends `SIGTERM` and waits for `terminationGracePeriodSeconds` before force-killing it. Your app needs to stop accepting new connections and finish in-flight requests in that window.

## 3. Set a sane maxSurge / maxUnavailable

```yaml
strategy:
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
```

`maxUnavailable: 0` guarantees you never drop below your desired replica count during a rollout — at the cost of briefly running extra pods.

## The result

None of these individually is complicated, but skip any one of them and your "zero-downtime" deploy will drop requests under load. Test it under real traffic, not just in a quiet staging environment.
""",
    },
    {
        "author": "marcusobrien",
        "category": "Node.js",
        "title": "Scaling Node.js Applications: Lessons from Production",
        "excerpt": "Node scales further than people assume — the real bottlenecks are usually blocking I/O, memory leaks, and single-threaded CPU work, not the runtime itself.",
        "content": """## Node is not your bottleneck

Most "Node doesn't scale" stories are actually stories about blocking the event loop, not about Node's architecture. Find the blocking call before you blame the runtime.

## Watch for synchronous work in the hot path

```js
// blocks the event loop for every request
const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512");
```

Swap synchronous crypto, JSON parsing of huge payloads, or heavy regex for their async equivalents or a worker thread.

## Horizontal scaling is cheap and effective

Node's single-threaded model makes the cluster module (or a process manager like PM2) an easy win — run one process per CPU core and let the OS load-balance.

## Memory leaks matter more at scale

A slow leak that's invisible in dev becomes a daily restart in production. Take heap snapshots under realistic load before you ship, not after an incident.

## The takeaway

Scaling Node.js is mostly disciplined engineering: keep the event loop unblocked, scale horizontally, and monitor memory like you would any long-running process.
""",
    },
    {
        "author": "jameskim",
        "category": "Career",
        "title": "How to Land Your First Developer Job in 2026",
        "excerpt": "The market has changed, but the fundamentals haven't: a focused portfolio, a clear story, and consistent practice beat chasing every framework.",
        "content": """## Depth beats breadth on a first resume

Hiring managers don't need to see ten half-finished projects. Two or three complete, deployed projects with real README files demonstrate far more than a long list of tutorials followed.

## Tell a story with your projects

Every project should answer: what problem did this solve, what did you decide and why, and what would you do differently now? That reflection is what separates a portfolio from a tutorial log.

## Practice the interview as a skill, not a test

Technical interviews are a skill you train, separate from being a good engineer. Practice explaining your thinking out loud, not just solving the problem silently.

## Don't ignore the unglamorous roles

Your first role doesn't have to be your dream company. A role where you'll learn from experienced engineers and touch a real production codebase is worth more early on than a prestigious name.

## Consistency compounds

Six months of steady, focused effort beats a frantic month of cramming before applications. Build in public, ship small things often, and let the compounding do the work.
""",
    },
    {
        "author": "priyapatel",
        "category": "Open Source",
        "title": "Contributing to Open Source: A Beginner's Roadmap",
        "excerpt": "Your first pull request doesn't need to fix a hard bug — it needs to teach you how a project actually works.",
        "content": """## Start by reading, not writing

Before opening a PR, spend time reading issues, recent pull requests, and the contributing guide. Understanding a project's conventions is half the work of a good contribution.

## Good first issues exist for a reason

Labels like `good first issue` or `help wanted` aren't just for beginners — maintainers use them to signal well-scoped, low-risk work. Start there rather than the most exciting open issue.

## Small PRs get merged faster

```
A 10-line fix with a clear description and a test
almost always beats a 300-line PR with no context.
```

Maintainers have limited review time. Respect it by keeping your first contributions small and well-explained.

## Documentation counts as a contribution

Fixing a confusing paragraph in the docs, adding a missing example, or improving an error message are all legitimate, valuable contributions — and a gentler way to learn a codebase.

## Keep showing up

The biggest predictor of becoming a trusted contributor isn't skill — it's consistency. Maintainers remember the people who keep showing up, respond to review feedback gracefully, and follow through.
""",
    },
    {
        "author": "marcusobrien",
        "category": "Laravel",
        "title": "Laravel 11: What's New and Why It Matters",
        "excerpt": "A leaner default application skeleton, streamlined configuration, and quality-of-life changes that reduce boilerplate without sacrificing power.",
        "content": """## A slimmer skeleton

Laravel 11 ships with a much leaner default project structure — fewer service provider files, a single `AppServiceProvider`, and consolidated configuration defaults.

## Per-second rate limiting

```php
RateLimiter::for('api', function (Request $request) {
    return Limit::perSecond(10)->by($request->user()?->id);
});
```

Previously limited to per-minute granularity, rate limiting now supports per-second windows — useful for APIs with bursty traffic patterns.

## Health routing out of the box

A `/up` health-check route ships by default, ready to wire into your load balancer or uptime monitor without any extra setup.

## Graceful encryption key rotation

Laravel 11 supports gracefully rotating encryption keys, decrypting with the previous key while re-encrypting with the new one — a real operational pain point finally addressed at the framework level.

## Should you upgrade?

If you're on Laravel 10, the migration path is smooth and the leaner defaults alone are worth it for new projects. For existing large applications, the wins are incremental but still worthwhile.
""",
    },
    {
        "author": "jameskim",
        "category": "Cloud",
        "title": "Designing Cost-Efficient Cloud Architectures on AWS",
        "excerpt": "Most cloud bills balloon from defaults, not necessity — right-sizing, spot capacity, and storage tiering usually cut costs the most.",
        "content": """## Start with right-sizing

Oversized instances are the single biggest source of cloud waste. Use actual CPU/memory utilization data, not gut feeling, before choosing an instance size.

## Spot capacity for stateless workloads

```
Batch jobs, CI runners, and stateless web tiers
are frequently 60-90% cheaper on Spot capacity.
```

Anything that can tolerate interruption and restart is a candidate for Spot pricing — the savings compound fast at scale.

## Storage tiering matters more than compute

S3 Intelligent-Tiering and lifecycle policies that move cold data to Glacier can cut storage costs dramatically for data that's rarely accessed after 30-90 days.

## Reserved capacity for the predictable baseline

Once you know your steady-state load, Reserved Instances or Savings Plans for that baseline — combined with on-demand or Spot for the variable peak — usually beats an all on-demand setup by a wide margin.

## Measure before you optimize

Cost optimization without visibility is guesswork. Tag everything, set up cost allocation reports, and revisit the architecture quarterly as usage patterns shift.
""",
    },
]


async def seed():
    db.init()

    print("Seeding categories...")
    category_ids = {}
    for name, description in CATEGORIES:
        try:
            category = await CategoryService.create_category(name, description)
            category_ids[name] = category["id"]
            print(f"  created: {name}")
        except HTTPException:
            found = await CategoryRepository.find_by_name(name)
            category_ids[name] = found.id
            print(f"  exists:  {name}")

    print("Seeding authors...")
    for author in AUTHORS:
        existing_user = await UsersRepository.find_by_username(author["username"])
        if existing_user:
            print(f"  exists:  {author['username']}")
            continue
        await AuthService.register_service(RegisterSchema(
            username=author["username"],
            email=author["email"],
            name=author["name"],
            password=PASSWORD,
            phone_number=author["phone_number"],
            birth=author["birth"],
            sex=author["sex"],
        ))
        user = await UsersRepository.find_by_username(author["username"])
        await UserService.update_profile(user, ProfileUpdateSchema(
            bio=author["bio"],
            social_github=author.get("social_github"),
            social_linkedin=author.get("social_linkedin"),
            social_twitter=author.get("social_twitter"),
            social_website=author.get("social_website"),
        ))
        print(f"  created: {author['username']}")

    print("Seeding articles...")
    for post in POSTS:
        author = await UsersRepository.find_by_username(post["author"])
        existing_posts, _ = await PostRepository.list_posts(
            page=1, page_size=1, search=post["title"], status=None,
        )
        if existing_posts:
            print(f"  exists:  {post['title']}")
            continue
        await PostService.create_post(author, PostCreate(
            title=post["title"],
            excerpt=post["excerpt"],
            content=post["content"],
            category_id=category_ids[post["category"]],
            status=PostStatus.PUBLISHED,
            is_featured=post.get("featured", False),
        ))
        print(f"  created: {post['title']}")

    print("Done.")


if __name__ == "__main__":
    asyncio.run(seed())
