type LandingPageProps = {
  onSubmitReport: () => void;
  onViewFeed: () => void;
};

const features = [
  {
    title: "Guided NGO Reporting",
    description: "A structured five-step workflow designed for NGO teams to capture health concerns without complexity.",
  },
  {
    title: "Global SDG Alignment",
    description: "Every submission is automatically mapped to SDG 3 health goals to ensure global credibility and impact.",
  },
  {
    title: "AI-Powered SITREPs",
    description: "Instantly transform raw field observations into professional UN-standard Situation Reports using Llama-3.1-8B.",
  },
  {
    title: "Public Visibility",
    description: "Surface your findings in a high-impact public feed that's easy to share with partners and judges.",
  },
];

function LandingPage({ onSubmitReport, onViewFeed }: LandingPageProps) {
  return (
    <section className="flex flex-1 flex-col items-center py-12 text-center">
      <div className="relative w-full max-w-5xl">
        {/* Subtle Decorative Elements */}
        <div className="absolute -top-16 left-1/2 -z-10 h-48 w-48 -translate-x-1/2 rounded-full bg-sky-100/50 blur-3xl" />
        
        <span className="inline-block rounded-full bg-sky-50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.4em] text-sky-600 ring-1 ring-sky-100">
          AI-Powered NGO Health Platform
        </span>
        
        <h2 className="mt-6 font-['Space_Grotesk',_sans-serif] text-5xl font-bold leading-[1.05] tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-7xl">
          Your frontline <br />
          <span className="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent italic">insights matter</span> <br />
          right here
        </h2>
        
        <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-slate-500">
          Ground Voice provides a structured framework to capture frontline health concerns, 
          organize them under SDG 3, and leverage AI to generate credible, globally-aligned statements.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={onSubmitReport}
            className="group relative flex items-center gap-2 rounded-full bg-slate-950 px-8 py-3.5 text-sm font-bold text-white shadow-2xl transition hover:-translate-y-1 hover:bg-slate-800"
          >
            Start reporting
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
          <button
            onClick={onViewFeed}
            className="rounded-full border border-slate-200 bg-white px-8 py-3.5 text-sm font-bold text-slate-600 transition hover:-translate-y-1 hover:bg-slate-50"
          >
            View public feed
          </button>
        </div>

        {/* Feature Blocks with Background */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div 
              key={feature.title} 
              className="group flex flex-col items-center rounded-[2.5rem] border border-slate-100 bg-white/50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-xl backdrop-blur-sm"
            >
              <div className="mb-6 h-1 w-10 rounded-full bg-sky-100 transition-all group-hover:w-16 group-hover:bg-sky-500" />
              <h3 className="text-lg font-bold tracking-tight text-slate-950">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Dedicated AI Block */}
        <div className="mt-20 rounded-[3rem] border border-sky-100 bg-gradient-to-br from-white to-sky-50/50 p-10 text-left shadow-xl shadow-sky-500/5 lg:p-16">
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-800">
                <span className="h-2 w-2 animate-pulse rounded-full bg-sky-600" />
                Intelligence Engine Active
              </span>
              <h3 className="mt-4 font-['Space_Grotesk',_sans-serif] text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Advanced AI SITREP Generation
              </h3>
              <p className="mt-6 text-lg leading-relaxed text-slate-600">
                Stop struggling with formal documentation. Our integrated Llama-3.1-8B intelligence 
                automatically parses your raw field notes into perfectly structured Situation Reports.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Powered By</p>
                  <p className="mt-1 font-semibold text-sky-600">Llama-3.1-8B</p>
                </div>
                <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Standard</p>
                  <p className="mt-1 font-semibold text-emerald-600">UN SITREP</p>
                </div>
              </div>
            </div>
            <div className="relative flex-1">
               <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-sm text-white shadow-2xl">
                 <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-rose-500" />
                      <div className="h-3 w-3 rounded-full bg-amber-500" />
                      <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">sitrep_generator.v1</span>
                 </div>
                 <p className="font-mono text-sky-400 mb-2">// Analyzing field notes...</p>
                 <p className="text-slate-300 mb-4 italic">"Raw: Malaria cases up in North region, clinic needs supplies..."</p>
                 <p className="font-mono text-emerald-400 mb-2">// Generated SITREP:</p>
                 <p className="font-bold text-white mb-1">**SITUATION OVERVIEW**</p>
                 <p className="text-slate-400">The Northern region reports a 24% spike in acute malaria cases...</p>
               </div>
               {/* Decorative glow */}
               <div className="absolute -inset-4 -z-10 rounded-full bg-sky-400/20 blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingPage;
