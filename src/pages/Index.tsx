import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SearchBar } from '@/components/SearchBar';
import { Header } from '@/components/Header';
import { Shield, Search, MapPin, Zap } from 'lucide-react';

const features = [
  { icon: Search, title: 'Recherche instantanée', desc: 'Trouvez vos médicaments en quelques secondes' },
  { icon: MapPin, title: 'Pharmacies à proximité', desc: 'Localisez les pharmacies avec stock disponible' },
  { icon: Shield, title: 'Données vérifiées', desc: 'Prix et stocks mis à jour en temps réel' },
  { icon: Zap, title: 'Paiement rapide', desc: 'MTN MoMo, Airtel Money ou portefeuille interne' },
];

export default function Index() {
  const navigate = useNavigate();

  const handleSelect = (med: any) => {
    // Sauvegarder dans le localStorage pour que la SearchPage le récupère
    const saved = localStorage.getItem('tictac_search_items');
    let items = [];
    if (saved) {
      try {
        items = JSON.parse(saved);
      } catch (e) {
        items = [];
      }
    }
    
    // Éviter les doublons
    if (!items.find((i: any) => i.id === med.id)) {
      items.push({
        id: med.id,
        name: med.name,
        category: med.category,
        genericName: med.generic_name || med.genericName
      });
      localStorage.setItem('tictac_search_items', JSON.stringify(items));
    }
    
    navigate(`/search`);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
          <img
            src="/banner.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/35" />
        </div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-foreground leading-tight tracking-tight">
              Trouvez vos <span className="text-primary italic">médicaments</span> en un instant
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
              Recherchez, comparez les prix et localisez les pharmacies qui ont vos médicaments en stock partout au Congo.
            </p>
            <div className="max-w-xl">
              <SearchBar onSelect={handleSelect} large />
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="font-semibold text-primary/80 uppercase tracking-wider">Populaire:</span>
              <span>Paracétamol, Amoxicilline, Chloroquine...</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: '50+', label: 'Pharmacies' },
              { value: '500+', label: 'Médicaments' },
              { value: '24/7', label: 'Disponibilité' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl font-heading font-bold text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 TICTAC</p>
        </div>
      </footer>
    </div>
  );
}
