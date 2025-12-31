'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-muted-foreground" />
            <div className="flex bg-muted rounded-lg p-1">
                <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-all ${language === 'en'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    EN
                </button>
                <button
                    onClick={() => setLanguage('my')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-all ${language === 'my'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    မြန်မာ
                </button>
            </div>
        </div>
    );
}
