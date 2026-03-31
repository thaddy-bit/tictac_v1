import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

export interface Medication {
  id: string | number;
  name: string;
  generic_name: string;
  category: string;
}

interface SearchBarProps {
  onSelect: (medication: any) => void;
  large?: boolean;
}

export function SearchBar({ onSelect, large }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const searchMeds = async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const data: any = await api.get(`/medicaments?q=${query}`);
          setResults(data.medicaments || []);
          setOpen(true);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setOpen(false);
      }
    };

    const timeoutId = setTimeout(searchMeds, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${large ? 'w-5 h-5' : 'w-4 h-4'}`} />
        <Input
          placeholder="Rechercher un médicament (ex: Paracétamol)..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={`${large ? 'pl-11 pr-4 h-14 text-lg rounded-xl' : 'pl-9'} bg-card border-border shadow-sm focus-visible:ring-primary w-full`}
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary" />}
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in divide-y divide-border/50">
          {results.map(med => (
            <div
              key={med.id}
              className="group flex items-center justify-between px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => { onSelect(med); setQuery(''); setOpen(false); }}
            >
              <div className="flex-1">
                <p className="font-bold text-foreground group-hover:text-primary transition-colors">{med.name}</p>
                <p className="text-xs text-muted-foreground">{med.category} · {med.generic_name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {open && results.length === 0 && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 p-6 text-center text-muted-foreground animate-fade-in">
          <p className="font-medium text-foreground mb-1">Aucun médicament trouvé</p>
          <p className="text-sm">Essayez un autre nom ou une substance générique.</p>
        </div>
      )}
    </div>
  );
}
