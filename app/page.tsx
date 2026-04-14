import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { ArrowRight, CheckCircle, Zap, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="px-6 py-20 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full mb-6">
          <Zap size={16} />
          <span className="text-sm font-semibold">
            AI-Powered Career Growth
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Land your dream job with{" "}
          <span className="text-indigo-600">CareerPulse AI</span>
        </h1>

        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Upload your resume, analyze it against job descriptions, and practice
          with our AI-powered interview coach.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/Auth"
            className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
          >
            Get Started Free <ArrowRight size={20} />
          </Link>
          <Link
            href="/about"
            className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-white py-20 px-6 border-t border-slate-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <FeatureCard
            icon={<CheckCircle className="text-indigo-600" />}
            title="Resume Scoring"
            desc="Get a detailed ATS score and find missing keywords instantly."
          />
          <FeatureCard
            icon={<Zap className="text-indigo-600" />}
            title="Interview Coach"
            desc="Practice with an AI that records your voice and gives live feedback."
          />
          <FeatureCard
            icon={<ShieldCheck className="text-indigo-600" />}
            title="Real-time Analysis"
            desc="Professional-grade insights based on 50,000+ success stories."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-6 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow bg-slate-50/50">
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{desc}</p>
    </div>
  );
}
