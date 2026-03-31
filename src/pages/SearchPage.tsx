import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { PaymentModal } from '@/components/PaymentModal';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Lock, MapPin, Package, Phone, Store, X, Bell, Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { PLATFORM_CONSTANTS } from '@/lib/constants';
import { Medication } from '@/types';

export default function SearchPage() {
  const { isAuthenticated, updateWallet } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedMeds, setSelectedMeds] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('tictac_search_items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const SEARCH_FEE = PLATFORM_CONSTANTS.SEARCH_FEE;

  // Save draft
  useEffect(() => {
    localStorage.setItem('tictac_search_items', JSON.stringify(selectedMeds));
  }, [selectedMeds]);

  const handleSelect = (med: Medication) => {
    if (!selectedMeds.find(m => m.id === med.id)) {
      setSelectedMeds(prev => [...prev, med]);
    } else {
      toast({ title: "Déjà ajouté", description: `${med.name} est déjà dans votre liste.`, variant: "destructive" });
    }
  };

  const removeMedication = (id: string | number) => {
    setSelectedMeds(prev => prev.filter(m => m.id !== id));
  };

  const handleUnlock = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setPaymentOpen(true);
  };

  const onPaymentSuccess = async (transactionId?: number | string) => {
    setPaymentOpen(false);
    setIsLoading(true);
    try {
      const response = await api.post<{ sessionId: string }>('/search/initiate', {
        medicamentIds: selectedMeds.map(m => m.id),
        transactionId
      });
      
      // Vider le brouillon local
      localStorage.removeItem(PLATFORM_CONSTANTS.STORAGE_KEYS.SEARCH_ITEMS);
      
      navigate(`/result/${response.sessionId}`);
    } catch (error: any) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockAlert = (medName: string) => {
    toast({
      title: "Alerte programmée",
      description: `Vous serez notifié dès que ${medName} sera de nouveau en stock.`,
    });
    
    // Sauvegarde de l'alerte
    const alerts = JSON.parse(localStorage.getItem('tictac_stock_alerts') || '[]');
    if (!alerts.includes(medName)) {
      const newAlerts = [...alerts, medName];
      localStorage.setItem('tictac_stock_alerts', JSON.stringify(newAlerts));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Rechercher un médicament</h1>
          <SearchBar onSelect={handleSelect} />
        </div>

        {selectedMeds.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
            {/* Selected Medications List - Vertical stack */}
            <div className="space-y-3 mb-8">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Ma prescription ({selectedMeds.length})</h2>
              {selectedMeds.map(med => (
                <motion.div
                  key={med.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="p-4 flex items-center justify-between border-primary/10 bg-white/50 backdrop-blur-sm shadow-sm hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{med.name}</p>
                        <p className="text-xs text-muted-foreground">{med.category} · {med.genericName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeMedication(med.id)}
                        className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Informational Card when meds are selected but result is locked */}
            {!isLoading && (
              <Card className="p-8 text-center border-dashed border-2 bg-secondary/30 backdrop-blur-sm shadow-inner mt-8">
                <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Détails de disponibilité verrouillés</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                  Débloquez pour voir quelles pharmacies ont vos {selectedMeds.length} médicaments en stock, avec les prix et localisations exactes sur une page dédiée.
                </p>
                <Button 
                  className="gradient-primary text-primary-foreground h-12 px-10 rounded-full shadow-glow hover:scale-105 transition-transform" 
                  onClick={handleUnlock}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Débloquer les résultats pour {SEARCH_FEE} FCFA
                </Button>
              </Card>
            )}
          </motion.div>
        )}
      </div>

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onSuccess={onPaymentSuccess}
        medicationName={selectedMeds.map(m => m.name).join(', ')}
      />
    </div>
  );
}
