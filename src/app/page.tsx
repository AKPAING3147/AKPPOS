import { ModeToggle } from '@/components/mode-toggle';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center font-mono selection:bg-primary selection:text-primary-foreground">
      <div className="absolute top-6 right-6 z-30">
        <ModeToggle />
      </div>

      {/* Pixel Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-20 w-full max-w-5xl px-6">
        <div className="flex flex-col items-center">

          {/* Main Title: AKPPOS */}
          <h1 className="text-7xl md:text-9xl font-black text-foreground mb-6 text-center tracking-tighter">
            AKPPOS
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 text-center max-w-2xl font-bold">
            NEXT_GEN_POINT_OF_SALE_SYSTEM
          </p>

          {/* Pixel Button */}
          <a
            href="/login"
            className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-primary-foreground bg-primary border-2 border-border hover:bg-background hover:text-foreground transition-all duration-0 shadow-[6px_6px_0px_0px_rgba(var(--shadow),1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]"
          >
            <span>[ GET_STARTED ]</span>
          </a>

          {/* Pixel Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
            {[
              {
                title: 'LIGHTNING_FAST',
                description: 'Optimized speed.'
              },
              {
                title: 'REAL_analytics',
                description: 'Track growth.'
              },
              {
                title: 'SECURE_DATA',
                description: 'Always safe.'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 text-center border-2 border-border bg-card shadow-[6px_6px_0px_0px_rgba(var(--shadow),0.1)] hover:shadow-[6px_6px_0px_0px_rgba(var(--shadow),1)] transition-all duration-0 hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-foreground mb-3 uppercase">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-muted-foreground text-xs font-bold tracking-widest uppercase z-20">
        <a href="https://github.com/AKPAING3147" target="_blank" rel="noopener noreferrer" className="hover:text-foreground hover:underline decoration-2 underline-offset-4 transition-colors">
          Made With Love By AKPaing
        </a>
      </div>

    </div>
  );
}
