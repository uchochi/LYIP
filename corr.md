<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Technical Docs | Documentation Style</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --bg: #0d0e10;
            --sidebar-bg: #09090b;
            --text-main: #d1d5db;
            --text-heading: #f8fafc;
            --text-muted: #71717a;
            --accent: #3b82f6;
            --border: #27272a;
            --code-bg: #000000;
            --callout-bg: #18181b;
            --callout-border: #3f3f46;
        }

        /* 1. RESET & OVERFLOW PREVENTION */
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
            /* Prevents accidental horizontal scroll from text */
            word-wrap: break-word; 
            overflow-wrap: break-word;
        }

        html, body {
            height: 100%;
            /* Critical: Prevents the entire page from scrolling horizontally */
            overflow-x: hidden; 
            background-color: var(--bg);
            color: var(--text-main);
            font-family: 'Inter', sans-serif;
        }

        body {
            display: flex;
        }

        /* --- Progress Bar --- */
        #progress-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            z-index: 1000;
        }
        #progress-bar {
            height: 100%;
            width: 0%;
            background: var(--accent);
        }

        /* --- Sidebar (Condensed) --- */
        aside {
            width: 240px;
            height: 100vh;
            background: var(--sidebar-bg);
            border-right: 1px solid var(--border);
            position: fixed;
            padding: 1.5rem;
            overflow-y: auto;
        }

        .logo {
            font-weight: 700;
            font-size: 1rem;
            color: var(--text-heading);
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .nav-group { margin-bottom: 1.5rem; }
        .nav-group-title {
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            margin-bottom: 0.75rem;
        }

        .nav-link {
            display: block;
            color: var(--text-muted);
            text-decoration: none;
            font-size: 0.85rem;
            padding: 0.4rem 0;
            transition: color 0.2s;
        }

        .nav-link:hover, .nav-link.active {
            color: var(--accent);
        }

        /* --- Main Content Area --- */
        main {
            margin-left: 240px;
            width: 100%;
            max-width: 850px; /* Optimized for reading eye-travel */
            padding: 2rem 3rem; /* Tightened padding */
        }

        /* --- Document Header (No more Hero) --- */
        header { 
            margin-bottom: 2.5rem; 
            border-bottom: 1px solid var(--border);
            padding-bottom: 2rem;
        }

        .breadcrumb {
            font-size: 0.8rem;
            color: var(--text-muted);
            margin-bottom: 0.5rem;
        }

        h1 {
            font-size: 2rem;
            color: var(--text-heading);
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 0.75rem;
        }

        .description {
            font-size: 1rem;
            color: var(--text-muted);
            line-height: 1.5;
        }

        /* --- Typography & Content --- */
        h2 {
            font-size: 1.5rem;
            color: var(--text-heading);
            margin: 2.5rem 0 1rem;
        }

        h3 {
            font-size: 1.15rem;
            color: var(--text-heading);
            margin: 1.5rem 0 0.75rem;
        }

        p { margin-bottom: 1.25rem; line-height: 1.6; }

        /* --- Elements --- */
        
        /* Inline Code */
        code {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85em;
            background: #1c1c1e;
            padding: 0.15rem 0.35rem;
            border-radius: 4px;
            color: #f472b6;
        }

        /* Code Blocks - Fixed Overflow */
        pre {
            background: var(--code-bg);
            padding: 1.25rem;
            border-radius: 8px;
            border: 1px solid var(--border);
            margin: 1.25rem 0;
            /* Essential for code overflow */
            overflow-x: auto; 
            white-space: pre; /* Maintains formatting */
        }

        pre code {
            color: #e2e8f0;
            padding: 0;
            background: transparent;
            font-size: 0.9rem;
        }

        /* Callouts - Compact Design */
        .callout {
            padding: 1rem 1.25rem;
            border-radius: 6px;
            margin: 1.5rem 0;
            background: var(--callout-bg);
            border: 1px solid var(--callout-border);
        }

        .callout-title {
            font-weight: 600;
            color: var(--accent);
            font-size: 0.85rem;
            text-transform: uppercase;
            display: block;
            margin-bottom: 0.4rem;
        }

        /* Step List */
        .step-item {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .step-number {
            flex-shrink: 0;
            width: 24px;
            height: 24px;
            background: var(--border);
            color: var(--text-heading);
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 700;
            margin-top: 0.3rem;
        }

        /* --- Animations --- */
        .reveal {
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }

        .reveal.visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* --- Responsive Fixes --- */
        @media (max-width: 1024px) {
            aside { display: none; }
            main { margin-left: 0; padding: 1.5rem; }
        }

    </style>
</head>
<body>

    <div id="progress-container"><div id="progress-bar"></div></div>

    <aside>
        <div class="logo">
            <div style="width:18px; height:18px; background:var(--accent); border-radius:3px;"></div>
            DevDocs
        </div>
        
        <div class="nav-group">
            <div class="nav-group-title">Overview</div>
            <a href="#" class="nav-link active">Introduction</a>
        </div>

        <div class="nav-group">
            <div class="nav-group-title">Deep Dives</div>
            <a href="#" class="nav-link">Tool Alpha</a>
            <a href="#" class="nav-link">Tool Beta</a>
        </div>
    </aside>

    <main>
        <!-- COMPACT HEADER -->
        <header class="reveal">
            <div class="breadcrumb">Tutorials &gt; Workflow</div>
            <h1>Workflow Optimization</h1>
            <p class="description">A technical guide to implementing high-performance build tools and development environments.</p>
        </header>

        <section class="reveal">
            <h2>Getting Started</h2>
            <p>To begin the implementation, you must first ensure your local environment meets the minimum requirements for the build engine.</p>
            
            <div class="callout">
                <span class="callout-title">Requirement</span>
                Node.js version 18.0.0 or higher is required for all following steps.
            </div>
        </section>

        <section class="reveal">
            <h2>Implementation Steps</h2>

            <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-content">
                    <h3>Package Initialization</h3>
                    <p>Initialize your configuration using the standard package manager command.</p>
                    <pre><code>npm init -y</code></pre>
                </div>
            </div>

            <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-content">
                    <h3>Environmental Variables</h3>
                    <p>Configure your <code>.env</code> file to prevent hardcoding sensitive credentials.</p>
                    <pre><code># Essential Environment Keys
API_ENDPOINT="https://api.example.com"
DEBUG_MODE=true</code></pre>
                </div>
            </div>
        </section>

        <section class="reveal">
            <h2>Advanced Configuration</h2>
            <p>For enterprise-grade deployments, you may need to extend the default configuration. Below is an example of a custom plugin injection.</p>
            
            <pre><code>import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Add extra configuration here
});</code></pre>
        </section>

        <footer style="margin-top: 4rem; padding: 2rem 0; border-top: 1px solid var(--border); color: var(--text-muted); font-size: 0.85rem; display: flex; justify-content: space-between;">
            <span>&copy; 2024 Documentation Engine</span>
            <a href="#" style="color: var(--accent); text-decoration: none;">Next: Tool Alpha &rarr;</a>
        </footer>
    </main>

    <script>
        // Progress Bar
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.getElementById("progress-bar").style.width = scrolled + "%";
        });

        // Intersection Observer (Subtle)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    </script>
</body>
</html>
