import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>

      {/* Header/Nav placeholder */}
      <header className="relative z-10 flex justify-between items-center p-6 border-b border-white/20 bg-white/40 backdrop-blur-md">
        <div className="text-2xl font-black tracking-tighter text-slate-900">B-SHOWSELL</div>
        <nav className="hidden md:flex gap-8 font-medium text-slate-700">
          <Link href="/products" className="hover:text-pink-600 transition-colors">Shop</Link>
          <Link href="/articles" className="hover:text-pink-600 transition-colors">Blog</Link>
          <a href="#" className="hover:text-pink-600 transition-colors">Campaigns</a>
          <a href="#" className="hover:text-pink-600 transition-colors">About</a>
        </nav>
        <div className="flex gap-4">
          <Link href="/login" className={buttonVariants({ variant: "ghost", className: "text-slate-700 hover:text-pink-600" })}>
            Login
          </Link>
          <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-6">Cart (0)</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex-grow flex items-center justify-center py-20 px-6">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="flex flex-col space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-700 font-medium text-sm w-max shadow-sm border border-pink-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-600"></span>
              </span>
              New Summer Collection
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-amber-500">Beauty Routine</span>
            </h1>
            
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
              Curated by top beauty experts. Discover our exclusive brand collaborations, 
              premium skincare, and the season&apos;s most sought-after makeup essentials.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/products" 
                className={buttonVariants({ size: "lg", className: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full shadow-lg shadow-pink-200 h-14 px-8 text-base" })}
              >
                Shop the Collection
              </Link>
              <Link 
                href="/articles" 
                className={buttonVariants({ size: "lg", variant: "outline", className: "rounded-full h-14 px-8 text-base border-slate-300 text-slate-700 hover:bg-slate-100 bg-white/50 backdrop-blur-sm" })}
              >
                Read Latest Articles
              </Link>
            </div>
            
            <div className="flex items-center gap-4 pt-8">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200"></div>
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium text-slate-600">
                <span className="font-bold text-slate-900">10k+</span> happy customers
              </div>
            </div>
          </div>
          
          <div className="relative group p-4 sm:p-0">
            {/* Glassmorphism card behind image */}
            <div className="absolute -inset-2 sm:-inset-4 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-2xl transform rotate-3 transition-transform duration-500 group-hover:rotate-6"></div>
            <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-br from-pink-100/50 to-amber-100/50 backdrop-blur-xl rounded-[2.5rem] transform -rotate-2 transition-transform duration-500 group-hover:-rotate-4"></div>
            
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-black/5 aspect-[4/5] md:aspect-square">
              <Image 
                src="/hero_beauty_store.jpg" 
                alt="Premium Beauty Products" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 hover:-translate-y-2 transition-all duration-300 z-20">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Top Rated</p>
                <p className="text-sm font-bold text-slate-900">100% Authentic</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
