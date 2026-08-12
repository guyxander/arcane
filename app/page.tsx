const selfPaced = "https://mahadum.vercel.app/courses/arcane-ai-website-development-93451f6f";

const tools = ["CODEX", "STITCH", "SUPABASE", "GITHUB", "VERCEL"];

const webDays = [
  ["01", "Shape the idea", "Turn a rough idea into a clear product plan with Codex."],
  ["02", "Design the experience", "Use Stitch to explore layouts, pages and a visual direction."],
  ["03", "Build by prompting", "Create and improve the first working version with Codex."],
  ["04", "Give it a memory", "Use Supabase to save and display real information."],
  ["05", "Save your progress", "Keep the project safe and organised with GitHub."],
  ["06", "Ship it live", "Publish on Vercel, test, polish and present the final product."],
];

const androidDays = [
  ["01", "Shape the app", "Choose a useful idea, audience and simple first version."],
  ["02", "Design the screens", "Use Stitch to map a clear, friendly mobile experience."],
  ["03", "Build with Codex", "Turn the plan into a working app, one screen at a time."],
  ["04", "Test on your phone", "Try the app on a real Android device and improve the feel."],
  ["05", "Connect real data", "Use Supabase so the app can remember information."],
  ["06", "Polish and present", "Fix issues, save on GitHub and demo the finished app."],
];

const projects = [
  { name: "Hazi", type: "Auction marketplace", text: "A Nigerian marketplace for discovering, listing, bidding on and selling pre-loved items.", href: "https://hazi.ng", code: "HAZI", className: "hazi" },
  { name: "CatApp", type: "Android product", text: "A mobile faith and community product with daily resources and parish discovery.", href: "https://catapp-download.ngbridz.chatgpt.site/", code: "CAT", className: "cat" },
  { name: "ChowTrek", type: "Food delivery", text: "A mobile-first food discovery and delivery experience for nearby vendors.", href: "https://chowtrek-landing.vercel.app/", code: "CT", className: "chow" },
  { name: "Korex Pharmacy", type: "Healthcare commerce", text: "An online pharmacy experience that makes products and services easier to access.", href: "https://korex-pharmacy.vercel.app/", code: "K+", className: "korex" },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <main>
      <div className="announcement"><span className="pulse" /><Countdown /></div>

      <nav className="nav shell" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Arcane Academy home">
          <Image src="/arcane-logo.jpg" alt="" width={40} height={40} />
          <span>ARCANE<small>ACADEMY</small></span>
        </a>
        <div className="navlinks">
          <a href="#courses">Courses</a>
          <a href="#curriculum">Curriculum</a>
          <a href="#projects">Projects</a>
          <a href="#instructor">Instructor</a>
        </div>
        <a className="button button-small" href="/enroll">Start enrollment <Arrow /></a>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span>ONLINE · AGES 18+</span><i /></div>
          <h1>DON&apos;T JUST USE<br />TECHNOLOGY.<br /><em>BUILD IT.</em></h1>
          <p>Turn your ideas into a real database-powered website or Android app with AI. No previous coding experience required.</p>
          <div className="hero-actions">
            <a className="button" href="/enroll">Build your learning plan <Arrow /></a>
            <a className="text-button" href={selfPaced} target="_blank" rel="noreferrer">Prefer self-paced? <Arrow /></a>
          </div>
          <div className="hero-stats">
            <div><strong>2</strong><span>weeks live</span></div>
            <div><strong>1hr</strong><span>per day</span></div>
            <div><strong>1</strong><span>real product</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="code-window" aria-hidden="true">
            <div className="window-dots"><i /><i /><i /></div>
            <p><b>YOU</b> Build me a product that...</p>
            <p><b>AI</b> Let&apos;s bring it to life.</p>
            <div className="fake-lines"><i /><i /><i /><i /></div>
          </div>
          <div className="portrait-wrap">
            <div className="portrait-glow" />
            <Image src="/anton.jpg" alt="Anthony Anton Okosa, Arcane Academy instructor" fill priority sizes="(max-width: 900px) 100vw, 45vw" />
          </div>
          <div className="floating-chip chip-one">IDEA → PRODUCT</div>
          <div className="floating-chip chip-two">NO EXPERIENCE NEEDED</div>
          <div className="orbit-mark">&lt;/&gt;</div>
        </div>
      </section>

      <section className="toolbelt" aria-label="Tools students will use">
        <div className="marquee">{[...tools, ...tools].map((tool, index) => <span key={`${tool}-${index}`}><i />{tool}</span>)}</div>
      </section>

      <section className="section shell intro" id="courses">
        <div className="section-head">
          <div><span className="kicker">CHOOSE YOUR BUILD PATH</span><h2>ONE IDEA.<br /><em>TWO WAYS TO BUILD.</em></h2></div>
          <p>Both beginner-friendly. Both practical. Pick the product you want to leave with.</p>
        </div>

        <div className="course-grid">
          <article className="course-card featured">
            <div className="card-top"><span>LIVE ONLINE</span><strong>01</strong></div>
            <div className="course-icon">&lt;/&gt;</div>
            <h3>AI WEBSITE<br />DEVELOPMENT</h3>
            <p>Plan, design and publish a database-powered website that works beautifully across devices.</p>
            <ul>
              <li>August 15–29, 2026</li><li>Monday–Saturday</li><li>9:00–10:00 AM WAT</li><li>Laptop required</li>
            </ul>
            <div className="price"><small>GROUP LIVE</small><strong>₦45,000</strong></div>
            <a className="button full" href="/enroll">Choose your package <Arrow /></a>
            <span className="fine">Group, personal, self-paced and physical options.</span>
          </article>

          <article className="course-card">
            <div className="card-top"><span>LIVE ONLINE</span><strong>02</strong></div>
            <div className="course-icon phone-icon">▣</div>
            <h3>AI ANDROID APP<br />DEVELOPMENT</h3>
            <p>Shape, build and test a functional Android app on your own phone using AI-powered workflows.</p>
            <ul>
              <li>August 15–29, 2026</li><li>Monday–Saturday</li><li>11:00 AM–12:00 PM WAT</li><li>Laptop + Android phone</li>
            </ul>
            <div className="price"><small>GROUP LIVE</small><strong>₦60,000</strong></div>
            <a className="button full" href="/enroll">Choose your package <Arrow /></a>
            <span className="fine">Group, personal and physical options.</span>
          </article>
        </div>

        <div className="self-paced">
          <div><span className="kicker">LEARN ON YOUR SCHEDULE</span><h3>AI Website Development — Self-Paced</h3><p>Start anytime on Mahadum and learn at your own pace, with one month of WhatsApp support.</p></div>
          <strong>₦15,000</strong>
          <a className="button button-dark" href="/enroll">Enroll self-paced <Arrow /></a>
        </div>
      </section>

      <section className="section dark-section" id="curriculum">
        <div className="shell">
          <div className="section-head">
            <div><span className="kicker">THE VIBE CODING METHOD</span><h2>LESS THEORY.<br /><em>MORE BUILDING.</em></h2></div>
            <p>You learn by describing, creating, testing and improving—not by memorising complicated technical language.</p>
          </div>
          <div className="curriculum-grid">
            <div className="curriculum-column">
              <div className="curriculum-title"><span>&lt;/&gt;</span><div><small>YOUR WEB JOURNEY</small><h3>Idea to live website</h3></div></div>
              {webDays.map(([num, title, text]) => <div className="lesson" key={num}><span>{num}</span><div><h4>{title}</h4><p>{text}</p></div></div>)}
            </div>
            <div className="curriculum-column">
              <div className="curriculum-title"><span>▣</span><div><small>YOUR ANDROID JOURNEY</small><h3>Idea to phone app</h3></div></div>
              {androidDays.map(([num, title, text]) => <div className="lesson" key={num}><span>{num}</span><div><h4>{title}</h4><p>{text}</p></div></div>)}
            </div>
          </div>
          <p className="curriculum-note">August 15 is your orientation and setup day. It is followed by two focused Monday–Saturday build weeks.</p>
        </div>
      </section>

      <section className="section shell outcomes">
        <span className="kicker">WHAT YOU LEAVE WITH</span>
        <div className="outcome-grid">
          <div><strong>01</strong><h3>A REAL PRODUCT</h3><p>A working website or Android app—not just notes and tutorials.</p></div>
          <div><strong>02</strong><h3>A NEW WORKFLOW</h3><p>The confidence to turn future ideas into products with AI.</p></div>
          <div><strong>03</strong><h3>A CERTIFICATE</h3><p>An Arcane Academy Certificate of Completion for eligible students.</p></div>
          <div><strong>04</strong><h3>ONGOING SUPPORT</h3><p>One month of guidance through your private WhatsApp class group.</p></div>
        </div>
      </section>

      <section className="section projects-section" id="projects">
        <div className="shell">
          <div className="section-head">
            <div><span className="kicker">BUILT BY YOUR INSTRUCTOR</span><h2>REAL PRODUCTS.<br /><em>REAL-WORLD PROBLEMS.</em></h2></div>
            <p>See the kind of practical product thinking that shapes every Arcane Academy class.</p>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => (
              <a className={`project-card ${project.className}`} href={project.href} target="_blank" rel="noreferrer" key={project.name}>
                <div className="project-art"><span>{project.code}</span></div>
                <div className="project-info"><small>0{index + 1} · {project.type}</small><h3>{project.name}</h3><p>{project.text}</p><b>View live project <Arrow /></b></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell instructor" id="instructor">
        <div className="instructor-photo"><Image src="/anton.jpg" alt="Anthony Anton Okosa" fill sizes="(max-width: 900px) 100vw, 42vw" /><span>YOUR INSTRUCTOR</span></div>
        <div className="instructor-copy">
          <span className="kicker">MEET ANTON</span>
          <h2>ANTHONY<br /><em>OKOSA.</em></h2>
          <p className="lead">Vibe Engineer and front-end developer with over three years of experience building responsive digital products.</p>
          <p>Anton holds a B.Sc. in Information Technology from the National Open University of Nigeria. He uses AI-assisted workflows to transform product ideas into polished web and mobile experiences.</p>
          <div className="credentials"><span>3+ YEARS BUILDING</span><span>B.SC. INFORMATION TECHNOLOGY</span><span>AI-ASSISTED DEVELOPMENT</span></div>
          <a className="text-button" href="https://anton-topaz-chi.vercel.app/" target="_blank" rel="noreferrer">Explore Anton&apos;s portfolio <Arrow /></a>
        </div>
      </section>

      <section className="section shell requirements">
        <div className="section-head"><div><span className="kicker">READY TO JOIN?</span><h2>BRING YOUR<br /><em>CURIOSITY.</em></h2></div><p>We&apos;ll handle the rest. Here&apos;s everything you need before your first class.</p></div>
        <div className="requirements-grid">
          <div className="requirement-main"><h3>YOUR SETUP</h3><ul><li>Laptop with at least 8GB RAM</li><li>Intel Core i5 or equivalent</li><li>Stable internet connection</li><li>Android phone for the app class</li></ul></div>
          <div><h3>YOUR ACCOUNTS</h3><ul><li>Codex / OpenAI</li><li>GitHub</li><li>Vercel</li><li>Supabase</li><li>Stitch</li></ul></div>
          <div><h3>WHAT&apos;S INCLUDED</h3><ul><li>Live Google Meet classes</li><li>Assignments via WhatsApp</li><li>One month of support</li><li>Completion certificate</li></ul></div>
        </div>
      </section>

      <section className="section faq shell">
        <div><span className="kicker">GOOD TO KNOW</span><h2>QUESTIONS,<br /><em>ANSWERED.</em></h2></div>
        <div className="faq-list">
          <details><summary>Do I need coding experience?<span>+</span></summary><p>No. The classes are designed for adult beginners. Curiosity and willingness to practise matter most.</p></details>
          <details><summary>Are sessions recorded?<span>+</span></summary><p>No. The classes are live and are not recorded, so students should be available for their selected class time.</p></details>
          <details><summary>How do I receive my certificate?<span>+</span></summary><p>Complete your final project and receive approval from your assigned tutor. Certificates include a public verification number.</p></details>
          <details><summary>How do enrollment and payment work?<span>+</span></summary><p>Submit your plan and preferred schedule. Our team will call you, confirm availability and provide the official bank account. Payment is verified manually.</p></details>
          <details><summary>What is the refund policy?<span>+</span></summary><p>Payments are non-refundable once classes begin on August 15, 2026. Missed classes are also non-refundable.</p></details>
        </div>
      </section>

      <section className="final-cta">
        <div className="shell">
          <span className="kicker">ENROLLMENT CLOSES AUGUST 14 · 11:59 PM WAT</span>
          <h2>YOUR IDEA IS<br />WAITING TO BE <em>BUILT.</em></h2>
          <p>Choose your course, learning package and preferred schedule. We’ll contact you to complete enrollment.</p>
          <div className="final-actions"><a className="button button-light" href="/enroll">Start enrollment <Arrow /></a></div>
        </div>
      </section>

      <footer>
        <div className="shell footer-grid">
          <a className="brand" href="#top"><Image src="/arcane-logo.jpg" alt="" width={40} height={40} /><span>ARCANE<small>ACADEMY</small></span></a>
          <p>Learn. Build. Ship.<br />Practical AI classes for adult creators.</p>
          <div><a href="https://wa.me/2349029840305" target="_blank" rel="noreferrer">WhatsApp: +234 902 984 0305</a><a href="mailto:okosaanthony@gmail.com">okosaanthony@gmail.com</a></div>
        </div>
        <div className="shell footer-bottom"><span>© 2026 Arcane Academy</span><span>Built for the next generation of creators.</span></div>
      </footer>
    </main>
  );
}
import Image from "next/image";
import { Countdown } from "./Countdown";
