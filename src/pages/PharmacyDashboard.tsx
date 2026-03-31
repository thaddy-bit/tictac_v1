import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { 
  Package, Edit2, Save, Plus, TrendingUp, 
  DollarSign, Archive, Search, AlertTriangle, 
  CheckCircle2, Loader2, X, Trash2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function PharmacyDashboard() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [globalMeds, setGlobalMeds] = useState<any[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editStock, setEditStock] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [newMedId, setNewMedId] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newPrice, setNewPrice] = useState('');

  // Mode creation nouveau medicament
  const [isCreatMode, setIsCreatMode] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedGeneric, setNewMedGeneric] = useState('');
  const [newMedCategory, setNewMedCategory] = useState('Général');
  const [newMedDosage, setNewMedDosage] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
    fetchGlobalCatalog();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invData, statsData] = await Promise.all([
        api.get<any[]>('/pharmacy/inventory'),
        api.get<any>('/pharmacy/stats')
      ]);
      setInventory(invData);
      setStats(statsData);
    } catch (error) {
      console.error('Pharmacy fetch error:', error);
      toast({ title: 'Erreur', description: 'Impossible de charger votre inventaire', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchGlobalCatalog = async () => {
    try {
      const data = await api.get<any>('/medicaments');
      setGlobalMeds(data.medicaments || []);
    } catch (error) {
      console.error('Global meds fetch error:', error);
    }
  };

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.generic_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [inventory, searchQuery]);

  const startEdit = (id: number, stock: number, price: number) => {
    setEditId(id);
    setEditStock(String(stock));
    setEditPrice(String(price));
  };

  const saveEdit = async (id: number) => {
    try {
      await api.put(`/pharmacy/inventory/${id}`, {
        quantity: Number(editStock),
        price: Number(editPrice)
      });
      setEditId(null);
      fetchData();
      toast({ title: 'Stock mis à jour', description: 'Les modifications ont été enregistrées.' });
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
      if (!confirm('Voulez-vous vraiment supprimer cet article de votre stock ?')) return;
      try {
          await api.delete(`/pharmacy/inventory/${id}`);
          toast({ title: 'Succès', description: 'Article supprimé de l\'inventaire' });
          fetchData();
      } catch (error) {
          toast({ title: 'Erreur', description: 'Échec de la suppression', variant: 'destructive' });
      }
  };

  const handleAdd = async () => {
    try {
      let finalMedId = newMedId;

      if (isCreatMode) {
          const res = await api.post<any>('/pharmacy/medicaments/create', {
              name: newMedName,
              generic_name: newMedGeneric,
              category: newMedCategory,
              dosage: newMedDosage,
              description: ''
          });
          finalMedId = res.medicament_id;
      }

      await api.post('/pharmacy/inventory', {
        medicament_id: Number(finalMedId),
        quantity: Number(newStock),
        price: Number(newPrice)
      });

      setAddOpen(false);
      resetAddForm();
      fetchData();
      fetchGlobalCatalog();
      toast({ title: 'Produit ajouté', description: `Votre inventaire a été mis à jour.` });
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' });
    }
  };

  const resetAddForm = () => {
      setNewMedId('');
      setNewStock('');
      setNewPrice('');
      setNewMedName('');
      setNewMedGeneric('');
      setIsCreatMode(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/20 text-foreground">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Tableau de Bord</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-1">Gestion de l'inventaire en temps réel</p>
          </div>
          <Button className="gradient-primary text-primary-foreground h-11 px-6 rounded-xl shadow-glow" onClick={() => setAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Ajouter un médicament
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: Package, label: 'Produits actifs', value: stats?.total_products || 0, color: 'text-primary', bg: 'bg-primary/10' },
            { icon: Archive, label: 'Unités disponibles', value: (stats?.total_units || 0).toLocaleString(), color: 'text-green-600', bg: 'bg-green-100' },
            { icon: DollarSign, label: 'Valeur du stock', value: `${(stats?.estimated_value || 0).toLocaleString()} FCFA`, color: 'text-amber-600', bg: 'bg-amber-100' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="border-none shadow-sm overflow-hidden group">
                <CardContent className="p-6 flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <s.icon className={`w-7 h-7 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
                    <p className="text-3xl font-heading font-bold text-foreground">{s.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Inventory Header with Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 px-1">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold">Mon Stock</h2>
            <Badge variant="secondary" className="bg-white border border-border/50">{filteredInventory.length} items</Badge>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher un médicament..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-full border-muted-foreground/20 bg-white focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Inventory Table */}
        <Card className="border-none shadow-premium overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Désignation</th>
                    <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Catégorie</th>
                    <th className="text-right p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Quantité</th>
                    <th className="text-right p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Prix Unitaire</th>
                    <th className="text-right p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Dernière mise à jour</th>
                    <th className="text-right p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {loading ? (
                    <tr><td colSpan={6} className="p-12 text-center text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" /> Chargement de l'inventaire...</td></tr>
                  ) : filteredInventory.map(item => (
                    <tr key={item.id} className="hover:bg-muted/10 transition-colors group text-foreground">
                      <td className="p-4">
                        <p className="font-bold text-foreground group-hover:text-primary transition-colors">{item.name}</p>
                        <p className="text-xs text-muted-foreground font-medium italic">{item.generic_name}</p>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-[10px] font-bold tracking-tight bg-primary/5 border-primary/10">{item.category}</Badge>
                      </td>
                      <td className="p-4 text-right">
                        {editId === item.id ? (
                          <Input type="number" value={editStock} onChange={e => setEditStock(e.target.value)} className="w-24 ml-auto h-8 text-right bg-white dark:bg-zinc-900" />
                        ) : (
                          <div className="flex items-center justify-end gap-2 text-foreground font-bold">
                             {item.quantity < 50 && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                             <span className={item.quantity < 50 ? 'text-amber-600' : 'text-foreground'}>{item.quantity}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {editId === item.id ? (
                          <Input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} className="w-28 ml-auto h-8 text-right bg-white dark:bg-zinc-900" />
                        ) : (
                          <span className="text-foreground font-bold">{item.price.toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">FCFA</span></span>
                        )}
                      </td>
                      <td className="p-4 text-right text-xs text-muted-foreground">
                        {new Date(item.last_updated).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1">
                          {editId === item.id ? (
                            <Button size="sm" variant="default" onClick={() => saveEdit(item.id)} className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700">
                              <Save className="w-4 h-4 text-white" />
                            </Button>
                          ) : (
                            <>
                              <Button size="sm" variant="ghost" onClick={() => startEdit(item.id, item.quantity, item.price)} className="h-8 w-8 p-0 hover:text-primary hover:bg-primary/5">
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)} className="h-8 w-8 p-0 hover:text-red-600 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredInventory.length === 0 && (
                <div className="p-20 text-center text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-10" />
                  <p>Aucun médicament trouvé pour "{searchQuery}"</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md rounded-2xl overflow-hidden p-0 border-none">
          <div className="bg-primary p-6 text-primary-foreground">
            <DialogTitle className="font-heading text-xl">Référencer un médicament</DialogTitle>
            <p className="text-primary-foreground/70 text-sm mt-1">Ajoutez un nouveau produit à votre catalogue pharmacie.</p>
          </div>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between bg-muted/30 p-3 rounded-xl">
                <p className="text-xs font-bold text-muted-foreground uppercase">Pas dans la liste ?</p>
                <Button size="sm" variant={isCreatMode ? "default" : "outline"} onClick={() => setIsCreatMode(!isCreatMode)} className="h-7 rounded-lg text-[10px] px-2">
                    {isCreatMode ? "Revenir à la liste" : "Créer nouveau"}
                </Button>
            </div>

            {isCreatMode ? (
                <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nom du médicament</Label>
                        <Input placeholder="Ex: Paracétamol 500mg" value={newMedName} onChange={e => setNewMedName(e.target.value)} className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nom générique (Substance)</Label>
                        <Input placeholder="Ex: Paracetamol" value={newMedGeneric} onChange={e => setNewMedGeneric(e.target.value)} className="rounded-xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Catégorie</Label>
                            <Input placeholder="Ex: Analgésique" value={newMedCategory} onChange={e => setNewMedCategory(e.target.value)} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dosage</Label>
                            <Input placeholder="Ex: 500mg" value={newMedDosage} onChange={e => setNewMedDosage(e.target.value)} className="rounded-xl" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Médicament existant</Label>
                    <select value={newMedId} onChange={e => setNewMedId(e.target.value)}
                        className="w-full h-11 rounded-xl border border-input bg-muted/30 px-4 text-sm focus:ring-2 focus:ring-primary outline-none">
                        <option value="">Sélectionner dans le dictionnaire...</option>
                        {globalMeds.map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.generic_name})</option>
                        ))}
                    </select>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quantité Initiale</Label>
                <Input type="number" value={newStock} onChange={e => setNewStock(e.target.value)} className="h-11 rounded-xl bg-muted/30" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Prix (FCFA)</Label>
                <Input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="h-11 rounded-xl bg-muted/30" placeholder="0" />
              </div>
            </div>
            <Button className="w-full gradient-primary text-primary-foreground h-12 rounded-xl shadow-glow font-bold text-base" onClick={handleAdd}
              disabled={(!isCreatMode && !newMedId) || (isCreatMode && !newMedName) || !newStock || !newPrice}>
              <CheckCircle2 className="w-5 h-5 mr-2" /> Valider l'ajout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
