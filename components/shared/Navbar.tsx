import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 border-b bg-blue">
      <h1 className="text-xl font-bold text-primary">CareerPulse AI</h1>
      <div className="space-x-6 hidden md:flex">
        <Link href="/about" className="hover:text-primary">
          About
        </Link>
        <Link href="/pricing" className="hover:text-primary">
          Pricing
        </Link>
        <Link href="/dashboard" className="hover:text-primary font-medium">
          Dashboard
        </Link>
      </div>
      {/* Auth button */}
      <button className="bg-primary text-white px-4 py-2 rounded-lg">
        Login
      </button>
    </nav>
  );
};
