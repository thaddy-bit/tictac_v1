import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, Package, Search, ChevronRight, Trash2, Calendar, Loader2, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';
import { Separator } from '@/components/ui/separator';

export default function SearchHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data: any = await api.get('/search/history');
      setHistory(data);
    } catch (error) {
      console.error('Fetch history error:', error);
    } finally {
      setLoading(false);
    }
  };

  const reloadSearch = (item: any) => {
    navigate(`/result/${item.id}`);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/20 text-foreground">
      <Header />
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
                <History className="w-8 h-8 text-primary" />
                Mon Historique
              </h1>
              <p className="text-muted-foreground">Retrouvez vos recherches de médicaments précédentes</p>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary opacity-20 mb-4" />
              <p className="text-muted-foreground font-medium">Chargement de votre historique...</p>
            </div>
          ) : history.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2 bg-white/50 backdrop-blur-sm shadow-none">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">Aucun historique</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Vous n'avez pas encore effectué de recherche débloquée.
              </p>
              <Button onClick={() => navigate('/search')} className="gradient-primary text-primary-foreground rounded-full px-8 shadow-glow">
                Lancer une recherche
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className={`group border border-border/50 transition-all overflow-hidden bg-white/80 backdrop-blur-sm ${
                      ((new Date().getTime() - new Date(item.timestamp).getTime()) > 60 * 60 * 1000) 
                        ? 'cursor-not-allowed opacity-80' 
                        : 'hover:border-primary/40 hover:shadow-lg cursor-pointer'
                    }`} 
                    onClick={() => {
                      const isExpired = (new Date().getTime() - new Date(item.timestamp).getTime()) > 60 * 60 * 1000;
                      if (!isExpired) reloadSearch(item);
                    }}
                  >
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-primary/60 uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(item.timestamp)}
                          </div>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const isExpired = (new Date().getTime() - new Date(item.timestamp).getTime()) > 60 * 60 * 1000;
                              return isExpired ? (
                                <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-red-200 text-[10px] h-5 font-bold px-2">
                                  EXPIRÉ
                                </Badge>
                              ) : null;
                            })()}
                            <div className="text-[10px] font-bold text-muted-foreground bg-muted p-1 px-2 rounded uppercase tracking-tighter">
                              ID: {String(item.id)}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {item.meds.map((med: any) => (
                            <Badge key={med.id} variant="secondary" className="bg-primary/5 text-primary border-primary/10 pl-2 pr-2 py-1 gap-1.5 font-medium rounded-lg">
                              <Package className="w-3 h-3" />
                              {med.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {(() => {
                        const isExpired = (new Date().getTime() - new Date(item.timestamp).getTime()) > 60 * 60 * 1000;
                        return (
                          <div className={`px-6 py-4 flex items-center justify-between border-t border-border/10 transition-colors ${
                            isExpired ? 'bg-muted/50 cursor-not-allowed' : 'bg-muted/30 group-hover:bg-primary/5'
                          }`}>
                            <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${
                              isExpired ? 'text-muted-foreground' : 'text-primary'
                            }`}>
                              {isExpired ? (
                                <>
                                  <AlertTriangle className="w-3 h-3" />
                                  Données expirées (Limite 1h)
                                </>
                              ) : (
                                <>
                                  <Search className="w-3 h-3" />
                                  Consulter les pharmacies et prix
                                </>
                              )}
                            </span>
                            {!isExpired && <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />}
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
