'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <div className="flex border-2 border-border bg-background">
                <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-black uppercase transition-all duration-0 border-r-2 border-border ${language === 'en'
                            ? 'bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_rgba(var(--shadow),1)]'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                        }`}
                >
                    EN
                </button>
                <button
                    onClick={() => setLanguage('my')}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-black uppercase transition-all duration-0 ${language === 'my'
                            ? 'bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_rgba(var(--shadow),1)]'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                        }`}
                >
                    မြန်မာ
                </button>
            </div>
        </div>
    );
}
