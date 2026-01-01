import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-mono selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      {/* Pixel Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Main Content - Centered */}
      <div className="relative z-20 w-full flex-1 flex items-center justify-center px-4 sm:px-6 py-24 sm:py-32">
        <div className="w-full max-w-5xl">
          <div className="flex flex-col items-center">

            {/* Main Title: AKPPOS */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-foreground mb-4 sm:mb-6 text-center tracking-tighter leading-none">
              AKPPOS
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-8 sm:mb-12 text-center max-w-2xl font-bold px-4">
              NEXT_GEN_POINT_OF_SALE_SYSTEM
            </p>

            {/* Pixel Button */}
            <a
              href="/signup"
              className="group relative inline-flex items-center justify-center px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-bold text-primary-foreground bg-primary border-2 border-border hover:bg-background hover:text-foreground transition-all duration-0 shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)] sm:shadow-[6px_6px_0px_0px_rgba(var(--shadow),1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] sm:hover:translate-x-[6px] sm:hover:translate-y-[6px]"
            >
              <span>[ GET_STARTED ]</span>
            </a>

            {/* Pixel Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-16 md:mt-24 w-full px-2 sm:px-0">
              {[
                {
                  title: 'LIGHTNING_FAST',
                  description: 'Optimized speed.'
                },
                {
                  title: 'REAL_ANALYTICS',
                  description: 'Track growth.'
                },
                {
                  title: 'SECURE_DATA',
                  description: 'Always safe.'
                }
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group p-6 sm:p-8 text-center border-2 border-border bg-card shadow-[4px_4px_0px_0px_rgba(var(--shadow),0.1)] hover:shadow-[4px_4px_0px_0px_rgba(var(--shadow),1)] sm:hover:shadow-[6px_6px_0px_0px_rgba(var(--shadow),1)] transition-all duration-0 hover:-translate-y-1"
                >
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-2 sm:mb-3 uppercase">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-20 py-6 sm:py-8 text-center px-4">
        <a href="https://github.com/AKPAING3147" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-[10px] sm:text-xs font-bold tracking-widest uppercase hover:text-foreground hover:underline decoration-2 underline-offset-4 transition-colors">
          Made With Love By AKPaing
        </a>
      </div>

    </div>
  );
}
