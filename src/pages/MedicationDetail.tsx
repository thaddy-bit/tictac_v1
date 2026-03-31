import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Medication } from '@/lib/auth-context';
import { 
  ChevronLeft, Package, ShieldCheck, Info, 
  MapPin, Store, Phone, Plus, Bell, Share2,
  AlertCircle, Loader2, Info as InfoIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import MapComponent from '@/components/MapComponent';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

// On étend l'interface User pour Medication si nécessaire ou on définit localement
interface ExtendedMedication extends Medication {
  name: string;
  generic_name: string;
  description: string;
  category: string;
  dosage: string;
  side_effects: string;
  interactions: string;
  image_url: string;
  manufacturer: string;
}

interface Availability {
  pharmacy_id: number;
  pharmacy_name: string;
  address: string;
  phone: string;
  city: string;
  quantity: number;
  price: number;
}

export default function MedicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [med, setMed] = useState<ExtendedMedication | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-4.2634, 15.2429]);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const res: any = await api.get(`/medicaments/${id}`);
        setMed(res.medicament);
        setAvailability(res.availability || []);
        
        if (res.availability && res.availability.length > 0) {
          // Note: Le backend actuel ne retourne pas lat/lng dans availability, 
          // Idéalement il faudrait les ajouter. Pour l'instant on garde le centre par défaut.
        }
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.message || "Impossible de charger les détails.",
          variant: "destructive"
        });
        navigate('/search');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id, navigate, toast]);

  const addToPrescription = () => {
    if (!med) return;
    const saved = localStorage.getItem('tictac_search_items');
    let selected = [];
    if (saved) {
      try {
        selected = JSON.parse(saved);
      } catch (e) {}
    }
    
    if (!selected.find((m: any) => m.id === med.id)) {
      selected.push({
        id: med.id,
        name: med.name,
        category: med.category,
        genericName: med.generic_name
      });
      localStorage.setItem('tictac_search_items', JSON.stringify(selected));
      toast({
        title: "Ajouté à la prescription",
        description: `${med.name} a été ajouté à votre liste de recherche.`,
      });
      navigate('/search');
    } else {
      toast({
        title: "Déjà présent",
        description: "Ce médicament est déjà dans votre liste.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (!med) return null;

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <Header />
      
      <div className="container mx-auto px-4 py-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 text-muted-foreground hover:text-primary">
          <ChevronLeft className="w-4 h-4" /> Retour
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-12 xl:col-span-8 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="overflow-hidden border-none shadow-premium bg-white">
                <div className="p-8">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary">{med.category}</Badge>
                        <Badge variant="outline" className={availability.length > 0 ? "border-green-200 text-green-600 bg-green-50" : "border-red-200 text-red-600 bg-red-50"}>
                          {availability.length > 0 ? 'En stock' : 'Rupture'}
                        </Badge>
                      </div>
                      <h1 className="text-4xl font-heading font-bold text-foreground">{med.name}</h1>
                      <p className="text-lg text-muted-foreground font-medium italic">{med.generic_name}</p>
                      
                      <div className="flex flex-wrap gap-4 mt-6">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-sm font-medium">
                          <ShieldCheck className="w-4 h-4 text-primary" /> {med.manufacturer || 'Fabricant certifié'}
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-sm font-medium">
                          <Package className="w-4 h-4 text-primary" /> {med.dosage || 'Dosage standard'}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[240px]">
                      <Button onClick={addToPrescription} className="gradient-primary h-12 rounded-xl shadow-glow gap-2 font-bold">
                        <Plus className="w-5 h-5" /> Ajouter à ma recherche
                      </Button>
                      <Button variant="outline" className="h-12 rounded-xl border-primary/20 gap-2">
                        <Share2 className="w-4 h-4" /> Partager la fiche
                      </Button>
                    </div>
                  </div>

                  <Separator className="my-8" />

                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                        <Info className="w-5 h-5 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg">Description et Usage</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {med.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-2xl border border-warning/20 bg-warning/5">
                        <h4 className="font-bold mb-2 flex items-center gap-2 text-warning-foreground">
                          <AlertCircle className="w-5 h-5" /> Effets secondaires
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-4">
                          {med.side_effects || "Aucun effet secondaire notable rapporté. Consultez votre médecin."}
                        </p>
                      </div>
                      <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5">
                        <h4 className="font-bold mb-2 flex items-center gap-2 text-primary">
                          <InfoIcon className="w-5 h-5" /> Interactions
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-4">
                          {med.interactions || "Pas d'interactions médicamenteuses majeures connues."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <div className="space-y-4">
              <h2 className="text-xl font-heading font-bold px-1">Disponibilité à proximité</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availability.map((item, index) => (
                  <motion.div 
                    key={item.pharmacy_id} 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group cursor-pointer hover:border-primary/40 transition-all hover:shadow-md h-full">
                      <div className="p-5 flex flex-col justify-between h-full">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{item.pharmacy_name}</h4>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3 text-primary" /> {item.address}, {item.city}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="w-3 h-3" /> {item.phone}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <p className="text-xl font-bold text-primary">{item.price.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">FCFA</span></p>
                          <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold tracking-widest text-primary hover:bg-primary/5">
                            Voir itinéraire
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
                
                {availability.length === 0 && (
                  <Card className="md:col-span-2 p-12 text-center border-dashed">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <h3 className="font-heading text-lg font-bold mb-2">Rupture de Stock</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                      Ce médicament n'est actuellement disponible dans aucune de nos pharmacies partenaires.
                    </p>
                    <Button variant="outline" className="gap-2 rounded-full border-primary/20">
                      <Bell className="w-4 h-4 text-primary" /> Me prévenir du retour en stock
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-12 xl:col-span-4 lg:sticky lg:top-24">
             <Card className="overflow-hidden border-none shadow-premium p-4 bg-white">
               <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                 <MapPin className="w-5 h-5 text-primary" /> Localisation
               </h3>
               <div className="rounded-xl overflow-hidden h-[400px] bg-muted/20 flex items-center justify-center border">
                  {/* Map Component would go here. Integration simplified for this phase. */}
                  <p className="text-xs text-muted-foreground italic text-center p-8">Carte interactive centrée sur Brazzaville.<br/>Localisation des pharmacies disponible sur mobile.</p>
               </div>
               
               <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                 <h4 className="text-sm font-bold flex items-center gap-2 mb-2">
                   <Store className="w-4 h-4 text-primary" /> Conseil Achat
                 </h4>
                 <p className="text-xs text-muted-foreground leading-relaxed">
                   Les prix affichés sont indicatifs et fixés par les pharmacies. 
                   TICTAC vous garantit la disponibilité du produit au moment de votre recherche.
                 </p>
               </div>
             </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
