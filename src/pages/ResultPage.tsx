import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { 
  MapPin, Package, Phone, Store, X, 
  Bell, ChevronLeft, Map as MapIcon, Share2, 
  Download, Loader2, AlertCircle, CheckCircle2,
  Timer, RefreshCw, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import MapComponent from '@/components/MapComponent';
import { useToast } from '@/hooks/use-toast';
import { SearchSession } from '@/types';
import { jsPDF } from 'jspdf';

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<SearchSession | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-4.2634, 15.2429]);
  const [activeAlerts, setActiveAlerts] = useState<string[]>([]);
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchResults();
  }, [id, isAuthenticated]);

  useEffect(() => {
    if (!results || isExpired) return;

    const interval = setInterval(() => {
      const createdAt = new Date(results.timestamp || Date.now());
      const now = new Date();
      const diffMs = now.getTime() - createdAt.getTime();
      const oneHourMs = 60 * 60 * 1000;
      
      if (diffMs >= oneHourMs) {
        setIsExpired(true);
        setTimeLeft(null);
        clearInterval(interval);
      } else {
        const remainingMs = oneHourMs - diffMs;
        const minutes = Math.floor(remainingMs / (1000 * 60));
        const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [results, isExpired]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const data = await api.get<SearchSession>(`/search/results/${id}`);
      
      // Trier les résultats en mettant les pharmacies ayant 100% en premier
      if (data.results && data.results.length > 0 && data.medications) {
        const totalRequested = data.medications.length || 1;
        data.results.sort((a, b) => {
          const ratioA = (a.items?.length || 0) / totalRequested;
          const ratioB = (b.items?.length || 0) / totalRequested;
          return ratioB - ratioA; // Décroissant
        });
      }
      
      setResults(data);
      
      // Centrer sur la première pharmacie si dispo
      if (data.results?.length > 0) {
        const first = data.results[0].pharmacy;
        if (first && first.lat && first.lng) {
          const lat = parseFloat(first.lat);
          const lng = parseFloat(first.lng);
          if (!isNaN(lat) && !isNaN(lng)) {
            setMapCenter([lat, lng]);
          }
        }
      }
    } catch (error: any) {
      console.error('Fetch results error:', error);
      
      if (error.status === 410 || error.data?.isExpired) {
        setIsExpired(true);
      } else {
        toast({ 
          title: "Erreur", 
          description: error.message || "Impossible de charger les résultats", 
          variant: "destructive" 
        });
        // Optionnel: rediriger si 403 (verrouillé)
        if (error.status === 403) navigate('/search');
      }
    } finally {
      setLoading(false);
    }
  };

  const centerOnPharmacy = (lat: any, lng: any) => {
    if (lat && lng) setMapCenter([parseFloat(lat), parseFloat(lng)]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/10">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <div className="text-center">
            <h2 className="font-heading text-xl font-bold">Analyse des stocks...</h2>
            <p className="text-muted-foreground text-sm">Nous interrogeons les pharmacies en temps réel.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/10">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-amber-600" />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading text-2xl font-bold">Résultats expirés</h2>
              <p className="text-muted-foreground">
                Cette session de recherche n'est plus valide. Les résultats sont limités à 1h pour garantir la précision des prix et des stocks.
              </p>
            </div>
            <Button 
                onClick={() => navigate('/search')} 
                className="w-full h-12 text-lg font-bold gap-2 group"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Lancer une nouvelle recherche
            </Button>
            <Button variant="ghost" onClick={() => navigate('/history')} className="w-full">
              Retour à l'historique
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!results) return null;

  const groupedResults = results.results || [];
  const requestedMeds = results.medications || [];
  const searchId = id;

  const handleStockAlert = (medName: string) => {
    toast({
      title: "Alerte programmée",
      description: `Vous serez notifié dès que ${medName} sera de nouveau en stock.`,
    });
    
    const alerts = JSON.parse(localStorage.getItem('tictac_stock_alerts') || '[]');
    if (!alerts.includes(medName)) {
      const newAlerts = [...alerts, medName];
      localStorage.setItem('tictac_stock_alerts', JSON.stringify(newAlerts));
      setActiveAlerts(newAlerts);
    }
  };

  const handleDownloadPDF = () => {
    if (!results) return;
    const doc = new jsPDF();
    const formatPdfAmount = (value: number | string) => {
      const amount = Number(value || 0);
      if (!Number.isFinite(amount)) return '0';
      return Math.round(amount).toString();
    };
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(20, 184, 166); // primary color (teal-ish)
    doc.text('TIC TAC - Rapport de Disponibilité', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`ID Recherche: ${id}`, 20, 30);
    doc.text(`Date: ${new Date(results.timestamp || Date.now()).toLocaleString('fr-FR')}`, 20, 36);
    
    doc.setDrawColor(230);
    doc.line(20, 42, 190, 42);
    
    // Prescribed meds
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text('Médicaments recherchés:', 20, 52);
    doc.setFont('helvetica', 'normal');
    
    requestedMeds.forEach((med, i) => {
        doc.setFontSize(11);
        doc.text(`- ${med.name || 'Médicament'} (${med.generic_name || 'Générique'})`, 25, 60 + (i * 7));
    });
    
    let y = 60 + (requestedMeds.length * 7) + 15;
    
    // Pharmacies
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Pharmacies partenaires trouvées:', 20, y);
    doc.setFont('helvetica', 'normal');
    y += 10;
    
    groupedResults.forEach((group, i) => {
        if (y > 250) { 
          doc.addPage(); 
          y = 20; 
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(20, 184, 166);
        doc.text(`${group.pharmacy?.name || 'Pharmacie Inconnue'}`, 20, y);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`${group.pharmacy?.address || 'Pas d\'adresse'} - ${group.pharmacy?.phone || 'N/A'}`, 20, y + 6);
        y += 14;
        
        doc.setTextColor(0);
        (group.items || []).forEach(item => {
            doc.text(`${item.name || 'Produit'} : ${formatPdfAmount(item.price)} FCFA`, 25, y);
            y += 6;
        });
        
        y += 8; // spacing between pharmacies
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} sur ${pageCount} - Généré par TIC TAC Platform`, 105, 285, { align: 'center' });
    }
    
    doc.save(`tictac-resultats-${id}-${Date.now()}.pdf`);
    
    toast({
      title: "PDF Généré",
      description: "Votre rapport de disponibilité a été téléchargé.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <Header />
      
      <div className="bg-white border-b border-primary/10 shadow-sm sticky top-16 z-10 backdrop-blur-md bg-white/80">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/history')} className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                Résultats de recherche
                <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary">DÉBLOQUÉ</Badge>
                {timeLeft && (
                  <Badge className="text-[10px] bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 flex gap-1 items-center">
                    <Timer className="w-3 h-3" /> expire dans {timeLeft}
                  </Badge>
                )}
              </h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Package className="w-3 h-3" /> {requestedMeds.length} médicament{requestedMeds.length > 1 ? 's' : ''} • ID: {searchId}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full text-xs font-bold gap-2 border-primary/20">
              <Share2 className="w-3.5 h-3.5" /> Partager
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownloadPDF}
              className="rounded-full text-xs font-bold gap-2 border-primary/20"
            >
              <Download className="w-3.5 h-3.5" /> PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: List of Pharmacies */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between mb-2 px-1">
              <h3 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <Store className="w-6 h-6 text-primary" />
                Pharmacies trouvées ({groupedResults.length})
              </h3>
            </div>

            {groupedResults.length === 0 ? (
              <Card className="p-8 text-center border-dashed">
                <p className="text-muted-foreground">Aucune pharmacie ne possède ces médicaments actuellement.</p>
              </Card>
            ) : (
              groupedResults.map((group, i) => {
                const ratio = (group.items?.length || 0) / (requestedMeds.length || 1);
                const isComplete = ratio === 1;
                const isPartial = ratio > 0.5 && ratio < 1;
                const isLow = ratio <= 0.5;

                let statusColor = "border-border";
                let badgeColor = "bg-primary/5 text-primary border-primary/10";
                let cardBg = "bg-white";

                if (isComplete) {
                  statusColor = "border-green-500 shadow-md";
                  badgeColor = "bg-green-500 text-white border-none";
                  cardBg = "bg-green-50/30";
                } else if (isPartial) {
                  statusColor = "border-amber-400";
                  badgeColor = "bg-amber-400 text-white border-none";
                  cardBg = "bg-amber-50/30";
                } else if (isLow) {
                  statusColor = "border-red-400";
                  badgeColor = "bg-red-400 text-white border-none";
                  cardBg = "bg-red-50/30";
                }

                return (
                  <motion.div
                    key={group.pharmacy?.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card 
                      className={`overflow-hidden transition-all hover:shadow-lg cursor-pointer group border-2 ${statusColor} ${cardBg}`}
                      onClick={() => centerOnPharmacy(group.pharmacy?.lat, group.pharmacy?.lng)}
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                            {isComplete && (
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1 animate-pulse">
                                <CheckCircle2 className="w-3 h-3" /> Meilleure option
                              </div>
                            )}
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                {group.pharmacy?.name || 'Pharmacie'}
                              </h4>
                              <Badge variant="outline" className={`text-[10px] uppercase tracking-wider h-5 font-bold ${badgeColor}`}>
                                {group.items?.length || 0}/{requestedMeds.length} disponible{(group.items?.length || 0) > 1 ? 's' : ''}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-primary" /> {group.pharmacy?.address || 'Pas d\'adresse'}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" /> {group.pharmacy?.phone || 'N/A'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Total estimé</p>
                            <p className="text-2xl font-heading font-bold text-primary">
                              {(group.items || []).reduce((sum, item) => sum + Number(item.price || 0), 0).toLocaleString()} <span className="text-sm font-normal text-muted-foreground">FCFA</span>
                            </p>
                          </div>
                        </div>
                      
                      <Separator className="my-4 opacity-50" />
                      
                      <div className="space-y-3">
                        {(group.items || []).map(item => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                                <Package className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-bold text-foreground">{item.name || 'Produit'}</p>
                              </div>
                            </div>
                            <p className="font-bold text-foreground">{(item.price || 0).toLocaleString()} FCFA</p>
                          </div>
                        ))}
                        
                        {requestedMeds.filter((sm: any) => !(group.items || []).find((gi: any) => gi.medicament_id === sm.id)).map((missing: any) => (
                           <div key={missing.id} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-3 opacity-40 grayscale">
                              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                                <X className="w-4 h-4 text-destructive" />
                              </div>
                              <p className="font-medium line-through">{missing.name || 'Inconnu'}</p>
                            </div>
                            <Button 
                              variant={"ghost"}
                              size="sm" 
                              onClick={(e) => { e.stopPropagation(); handleStockAlert(missing.name); }}
                              className="h-7 px-2 text-[10px] uppercase font-bold tracking-tighter text-primary hover:text-primary hover:bg-primary/5"
                            >
                              <Bell className="w-3 h-3 mr-1" />
                              M'alerter
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Right Side: Sticky Map and Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-40 space-y-6">
            <Card className="p-4 border-primary/10 overflow-hidden shadow-xl bg-white">
              <MapComponent pharmacies={groupedResults.map(g => g.pharmacy)} center={mapCenter} />
            </Card>
            
            <Card className="p-6 border-primary/10 bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-sm shadow-sm">
              <h4 className="font-heading font-bold text-lg mb-2">💊 Votre Prescription</h4>
              <div className="space-y-2">
                {requestedMeds.map((med: any) => (
                   <div key={med.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                     <Package className="w-3.5 h-3.5 text-primary" /> {med.name}
                   </div>
                ))}
              </div>
              <Separator className="my-4" />
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                Recherché le {new Date(results.timestamp || Date.now()).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
