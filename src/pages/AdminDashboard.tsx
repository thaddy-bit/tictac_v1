import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { 
  Users, Store, Receipt, Banknote, TrendingUp, 
  AlertCircle, Search, Filter, Download, 
  ArrowUpRight, ArrowDownRight, Activity,
  Edit2, Plus, Check, Trash2, Settings, MessageSquare,
  Loader2, Wallet, Info, Save, X, CheckSquare
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const { toast } = useToast();
  const [tab, setTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // States pour les données réelles
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [config, setConfig] = useState<any>({ search_fee: 200, commission_percent: 10 });
  const [editMed, setEditMed] = useState<any>(null);
  const [creditUser, setCreditUser] = useState<any>(null);
  const [creditAmount, setCreditAmount] = useState('');
  const [creditReason, setCreditReason] = useState('');

  useEffect(() => {
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, pharmData, txData, medData, ticketsData, payoutsData, configData] = await Promise.all([
        api.get<any>('/admin/stats'),
        api.get<any[]>('/admin/users'),
        api.get<any>('/pharmacies'), 
        api.get<any[]>('/admin/transactions'),
        api.get<any>('/medicaments'),
        api.get<any[]>('/admin/support'),
        api.get<any[]>('/admin/payouts'),
        api.get<any>('/admin/config')
      ]);
      
      setStats(statsData);
      setUsers(usersData);
      setPharmacies(pharmData.pharmacies || []);
      setTransactions(txData);
      setMedications(medData.medicaments || []);
      setTickets(ticketsData);
      setPayouts(payoutsData);
      setConfig(configData);
    } catch (error) {
      console.error('Fetch admin data error:', error);
      toast({ 
        title: 'Erreur', 
        description: 'Impossible de charger les données administratives',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      (u.name || `${u.first_name} ${u.last_name}`).toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone?.includes(searchQuery)
    );
  }, [users, searchQuery]);

  const filteredTx = useMemo(() => {
    return transactions.filter(t => 
      t.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.user_phone?.includes(searchQuery)
    );
  }, [transactions, searchQuery]);

  const handlePayout = async (pharmacyId: number, amount: number) => {
    try {
        await api.post('/admin/payouts', { 
            pharmacy_id: pharmacyId, 
            amount, 
            period: new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' }) 
        });
        toast({ title: 'Versement créé', description: 'Le versement a été enregistré avec succès' });
        fetchData();
    } catch (error) {
        toast({ title: 'Erreur', description: 'Échec de la création du versement', variant: 'destructive' });
    }
  };

  const updateTicketStatus = async (ticketId: number, status: string) => {
      try {
          await api.put(`/admin/support/${ticketId}`, { status });
          toast({ title: 'Succès', description: 'Statut du ticket mis à jour' });
          fetchData();
      } catch (error) {
          toast({ title: 'Erreur', description: 'Échec de la mise à jour', variant: 'destructive' });
      }
  };

  const handleDeleteUser = async (id: number) => {
      if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;
      try {
          await api.delete(`/admin/users/${id}`);
          toast({ title: 'Utilisateur supprimé' });
          fetchData();
      } catch (error) {
          toast({ title: 'Erreur', description: 'Échec de la suppression', variant: 'destructive' });
      }
  };

  const handleDeleteMedication = async (id: number) => {
      if (!confirm('Voulez-vous vraiment supprimer ce médicament du catalogue ?')) return;
      try {
          await api.delete(`/admin/medicaments/${id}`);
          toast({ title: 'Médicament supprimé' });
          fetchData();
      } catch (error) {
          toast({ title: 'Erreur', description: 'Échec de la suppression', variant: 'destructive' });
      }
  };

  const handleUpdateMedication = async () => {
    try {
        await api.put(`/admin/medicaments/${editMed.id}`, editMed);
        toast({ title: 'Catalogue mis à jour' });
        setEditMed(null);
        fetchData();
    } catch (error) {
        toast({ title: 'Erreur', description: 'Échec de la modification', variant: 'destructive' });
    }
  };

  const handleCreditWallet = async () => {
    if (!creditUser || !creditAmount || Number(creditAmount) <= 0) return;
    try {
      await api.put(`/admin/users/${creditUser.id}/wallet`, { amount: Number(creditAmount), reason: creditReason || 'Crédit admin' });
      toast({ title: 'Solde crédité', description: `${Number(creditAmount).toLocaleString()} FCFA ajoutés au compte de ${creditUser.first_name || creditUser.name}` });
      setCreditUser(null);
      setCreditAmount('');
      setCreditReason('');
      fetchData();
    } catch (error) {
      toast({ title: 'Erreur', description: 'Échec du crédit', variant: 'destructive' });
    }
  };

  const handleValidatePayout = async (payoutId: number) => {
      try {
          await api.put(`/admin/payouts/${payoutId}`, { status: 'completed' });
          toast({ title: 'Versement validé', description: 'Le statut a été mis à jour.' });
          fetchData();
      } catch (error) {
          toast({ title: 'Erreur', description: 'Échec de la validation', variant: 'destructive' });
      }
  };

  const handleSaveConfig = async () => {
      try {
          await api.put('/admin/config', config);
          toast({ title: 'Configuration sauvegardée' });
      } catch (error) {
          toast({ title: 'Erreur', description: 'Échec de la sauvegarde', variant: 'destructive' });
      }
  };

  const statusLabel = (s: string) => {
    switch (s) {
      case 'completed': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 py-1">Terminé</Badge>;
      case 'pending': return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-3 py-1">En cours</Badge>;
      case 'failed': return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-none px-3 py-1">Échoué</Badge>;
      default: return <Badge variant="outline">{s}</Badge>;
    }
  };

  const roleLabel = (r: string) => {
    switch (r) {
      case 'admin': return <Badge className="gradient-primary text-white border-none py-1">Admin</Badge>;
      case 'pharmacy': return <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-none py-1">Pharmacie</Badge>;
      default: return <Badge variant="outline" className="text-muted-foreground py-1">Utilisateur</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Administration TICTAC</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Performance de la plateforme en temps réel
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl border-border/50 bg-white">
              <Download className="w-4 h-4 mr-2" /> Rapport mensuel
            </Button>
            <Button className="gradient-primary text-primary-foreground rounded-xl shadow-glow">
              <Plus className="w-4 h-4 mr-2" /> Nouvelle Pharmacie
            </Button>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList className="bg-white p-1 rounded-xl border border-border/50 shadow-sm flex flex-wrap w-fit h-auto">
            <TabsTrigger value="overview" className="rounded-lg px-4 py-2 text-sm font-bold">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="users" className="rounded-lg px-4 py-2 text-sm font-bold">Utilisateurs</TabsTrigger>
            <TabsTrigger value="pharmacies" className="rounded-lg px-4 py-2 text-sm font-bold">Pharmacies</TabsTrigger>
            <TabsTrigger value="catalogue" className="rounded-lg px-4 py-2 text-sm font-bold">Catalogue</TabsTrigger>
            <TabsTrigger value="payouts" className="rounded-lg px-4 py-2 text-sm font-bold">Versements</TabsTrigger>
            <TabsTrigger value="support" className="rounded-lg px-4 py-2 text-sm font-bold">Support</TabsTrigger>
            <TabsTrigger value="transactions" className="rounded-lg px-4 py-2 text-sm font-bold">Transactions</TabsTrigger>
            <TabsTrigger value="config" className="rounded-lg px-4 py-2 text-sm font-bold">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Users, label: 'Utilisateurs', value: stats?.summary?.users || 0, trend: '+12%', up: true, color: 'text-blue-600', bg: 'bg-blue-100' },
                { icon: Store, label: 'Pharmacies', value: stats?.summary?.pharmacies || 0, trend: '+2', up: true, color: 'text-green-600', bg: 'bg-green-100' },
                { icon: Receipt, label: 'Revenu Search', value: `${(stats?.summary?.revenue || 0).toLocaleString()}`, trend: '+5.4%', up: true, color: 'text-amber-600', bg: 'bg-amber-100' },
                { icon: TrendingUp, label: 'Fonds Mobiles', value: `${(stats?.summary?.topups || 0).toLocaleString()}`, trend: '-2.1%', up: false, color: 'text-purple-600', bg: 'bg-purple-100' },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                  <Card className="border-none shadow-sm overflow-hidden bg-white">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center`}>
                          <s.icon className={`w-6 h-6 ${s.color}`} />
                        </div>
                        <div className={`flex items-center text-xs font-bold ${s.up ? 'text-green-600' : 'text-red-600'}`}>
                          {s.up ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                          {s.trend}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
                      <h3 className="text-2xl font-heading font-bold text-foreground mt-1">
                        {s.value} {s.label.includes('Fonds') || s.label.includes('Revenu') ? <span className="text-sm font-normal text-muted-foreground">FCFA</span> : ''}
                      </h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Activity Chart Simulator */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden bg-white">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">Activité hebdomadaire</CardTitle>
                  <CardDescription>Volume des recherches débloquées par jour</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between gap-2 pt-4">
                    {stats?.activity?.map((activity: any, i: number) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <div 
                          className="w-full bg-primary/20 rounded-t-lg relative transition-all group-hover:bg-primary/40" 
                          style={{ height: `${Math.min((activity.count / 10) * 100, 100)}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {activity.amount}FCFA
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                          {new Date(activity.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                        </span>
                      </div>
                    ))}
                    {(!stats?.activity || stats.activity.length === 0) && (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                            Aucune activité récente (derniers 7 jours)
                        </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm overflow-hidden bg-white">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">Répartition Paiements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  {[
                    { label: 'MTN Mobile Money', value: 65, color: 'bg-amber-400' },
                    { icon: Store, label: 'Airtel Money', value: 25, color: 'bg-red-500' },
                    { icon: Receipt, label: 'Portefeuille TICTAC', value: 10, color: 'bg-primary' },
                  ].map(m => (
                    <div key={m.label} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span>{m.label}</span>
                        <span>{m.value}%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${m.value}%` }} 
                          className={`h-full ${m.color}`} 
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="font-heading text-xl font-bold">Annuaire Utilisateurs</h2>
              <div className="relative w-72">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <Input 
                   placeholder="Rechercher un utilisateur..." 
                   className="pl-10 h-10 rounded-full border-border/50 bg-white"
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                 />
              </div>
            </div>
            <Card className="border-none shadow-premium overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Identité</th>
                        <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Coordonnées</th>
                        <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Rôle</th>
                        <th className="text-right p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Solde Mob.</th>
                        <th className="text-right p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {loading ? (
                        <tr><td colSpan={5} className="p-8 text-center text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Chargement...</td></tr>
                      ) : filteredUsers.length === 0 ? (
                        <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Aucun utilisateur trouvé</td></tr>
                      ) : filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-muted/10 transition-colors group">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                                {u.first_name?.charAt(0) || u.name?.charAt(0) || 'U'}
                              </div>
                              <p className="font-bold text-foreground">{u.first_name} {u.last_name}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="text-sm text-foreground">{u.email}</p>
                            <p className="text-xs text-muted-foreground">{u.phone}</p>
                          </td>
                          <td className="p-4">{roleLabel(u.role)}</td>
                          <td className="p-4 text-right">
                             <span className="font-bold text-foreground">{(u.wallet_balance || 0).toLocaleString()} FCFA</span>
                          </td>
                          <td className="p-4 text-right flex items-center justify-end gap-1">
                             <Button variant="ghost" size="sm" onClick={() => setCreditUser(u)} className="h-8 w-8 p-0 rounded-full hover:bg-green-50 hover:text-green-600" title="Créditer le solde">
                               <Wallet className="w-4 h-4" />
                             </Button>
                             <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(u.id)} className="h-8 w-8 p-0 rounded-full hover:bg-red-50 hover:text-red-600" title="Supprimer">
                               <Trash2 className="w-4 h-4" />
                             </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pharmacies" className="space-y-4">
            <h2 className="font-heading text-xl font-bold px-1">Réseau Officinal</h2>
            <Card className="border-none shadow-premium overflow-hidden bg-white">
              <CardContent className="p-0 text-foreground">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Officine</th>
                        <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Localisation</th>
                        <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Statut</th>
                        <th className="text-right p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {loading ? (
                        <tr><td colSpan={4} className="p-8 text-center text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Chargement...</td></tr>
                      ) : pharmacies.length === 0 ? (
                        <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Aucune pharmacie enregistrée</td></tr>
                      ) : pharmacies.map(p => (
                        <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                          <td className="p-4 font-bold">{p.name}</td>
                          <td className="p-4">
                            <p className="text-sm">{p.address}</p>
                            <p className="text-xs text-muted-foreground">{p.phone}</p>
                          </td>
                          <td className="p-4">
                            <Badge className={p.is_active ? 'bg-green-100 text-green-700 hover:bg-green-100 border-none px-3' : 'bg-muted text-muted-foreground border-none px-3'}>
                              {p.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="p-4 text-right">
                            <Button size="sm" variant="outline" onClick={() => handlePayout(p.name)} className="rounded-lg h-8 border-primary/20 text-primary hover:bg-primary/5">
                              <Banknote className="w-3.5 h-3.5 mr-1" /> Verser
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CATALOGUE TAB */}
          <TabsContent value="catalogue" className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="font-heading text-xl font-bold">Catalogue Médicaments</h2>
              <div className="flex gap-2">
                <Input placeholder="Rechercher produit..." className="w-64 h-10 rounded-full bg-white" />
                <Button className="gradient-primary text-white h-10 px-4 rounded-xl shadow-glow">
                  <Plus className="w-4 h-4 mr-2" /> Nouveau
                </Button>
              </div>
            </div>
            <Card className="border-none shadow-premium overflow-hidden bg-white">
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                     <tr>
                       <th className="text-left p-4 font-bold text-muted-foreground">Médicament</th>
                       <th className="text-left p-4 font-bold text-muted-foreground">Substance</th>
                       <th className="text-left p-4 font-bold text-muted-foreground">Catégorie</th>
                       <th className="text-right p-4 font-bold text-muted-foreground">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {loading ? (
                      <tr><td colSpan={4} className="p-8 text-center text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td></tr>
                    ) : medications.length === 0 ? (
                      <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Aucun médicament référencé</td></tr>
                    ) : medications.map(m => (
                      <tr key={m.id} className="hover:bg-muted/5">
                        <td className="p-4 font-bold">{m.name}</td>
                        <td className="p-4 italic text-muted-foreground">{m.generic_name}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="bg-primary/5 border-primary/10 text-primary">{m.category}</Badge>
                        </td>
                        <td className="p-4 text-right text-foreground">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setEditMed(m)} className="h-8 w-8 p-0 rounded-full hover:text-primary">
                                <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteMedication(m.id)} className="h-8 w-8 p-0 rounded-full hover:text-red-600">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PAYOUTS TAB */}
          <TabsContent value="payouts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-none shadow-glow">
                <CardContent className="p-6">
                  <p className="opacity-80 text-sm font-bold uppercase tracking-widest mb-1">Total à régler</p>
                  <h3 className="text-3xl font-heading font-bold">1 245 000 FCFA</h3>
                  <Button variant="secondary" className="w-full mt-4 font-bold shadow-lg">
                    Lancer le règlement global
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-white border-none shadow-sm text-foreground">
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mb-1">Dernière clôture</p>
                  <h3 className="text-3xl font-heading font-bold text-foreground">25 Mars 2026</h3>
                  <p className="text-xs text-muted-foreground mt-2">Période du 01 au 25 Mars 2026</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="border-none shadow-premium overflow-hidden bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Historique des versements</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-foreground">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left p-4 font-bold text-muted-foreground">Pharmacie</th>
                      <th className="text-left p-4 font-bold text-muted-foreground">Période</th>
                      <th className="text-right p-4 font-bold text-muted-foreground">Montant net</th>
                      <th className="text-right p-4 font-bold text-muted-foreground">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {payouts.length === 0 ? (
                        <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Aucun versement enregistré</td></tr>
                    ) : payouts.map(p => (
                        <tr key={p.id} className="hover:bg-muted/5">
                          <td className="p-4 font-bold">{p.pharmacy_name}</td>
                          <td className="p-4 text-muted-foreground">{p.period}</td>
                          <td className="p-4 text-right font-bold">{p.amount.toLocaleString()} FCFA</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <Badge className={`${p.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'} border-none`}>
                                    {p.status === 'completed' ? 'Réglé' : 'En cours'}
                                </Badge>
                                {p.status === 'pending' && (
                                    <Button size="sm" variant="outline" onClick={() => handleValidatePayout(p.id)} className="h-7 text-[10px] rounded-lg">
                                        Valider
                                    </Button>
                                )}
                            </div>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <h2 className="font-heading text-xl font-bold px-1 text-foreground">Messages Support</h2>
            <div className="space-y-3">
              {loading ? (
                  <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
              ) : tickets.length === 0 ? (
                  <Card className="p-8 text-center text-muted-foreground">Aucun ticket en attente</Card>
              ) : tickets.map((t) => (
                <Card key={t.id} className="border-none shadow-premium hover:shadow-md transition-all bg-white">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${t.status === 'new' ? 'bg-primary' : 'bg-muted'}`} />
                      <div>
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-foreground">{t.first_name} {t.last_name}</p>
                            <span className="text-[10px] text-muted-foreground font-mono">{t.phone}</span>
                        </div>
                        <p className="text-sm text-primary font-medium">{t.subject}</p>
                        <p className="text-xs text-muted-foreground italic mt-1">"{t.message}"</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{new Date(t.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {t.status !== 'resolved' && (
                            <Button size="sm" variant="outline" onClick={() => updateTicketStatus(t.id, 'resolved')} className="rounded-lg h-7 text-xs">
                                Marquer Résolu
                            </Button>
                        )}
                        <Badge variant={t.status === 'resolved' ? 'secondary' : 'default'} className="rounded-lg h-7 border-none capitalize">
                          {t.status === 'resolved' ? 'Résolu' : t.status}
                        </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* CONFIG TAB */}
          <TabsContent value="config" className="space-y-6">
            <h2 className="font-heading text-xl font-bold px-1 text-foreground">Paramètres du Système</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-premium bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">Paramètres Financiers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                       <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Frais de recherche (FCFA)</Label>
                       <Input type="number" value={config?.search_fee} onChange={e => setConfig({...config, search_fee: Number(e.target.value)})} className="h-12 rounded-xl border-border/50 bg-white" />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Commission TICTAC (%)</Label>
                        <Input type="number" value={config?.commission_percent} onChange={e => setConfig({...config, commission_percent: Number(e.target.value)})} className="h-12 rounded-xl border-border/50 bg-white" />
                     </div>
                     <Button onClick={handleSaveConfig} className="w-full gradient-primary text-white h-12 rounded-xl mt-4 font-bold shadow-glow">
                        <Save className="w-4 h-4 mr-2" /> Enregistrer les modifications
                     </Button>
                  </CardContent>
                </Card>

               <Card className="border-none shadow-premium bg-white">
                 <CardHeader>
                   <CardTitle className="text-lg">Seuils et Alertes</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Alerte Stock Bas (Unités)</Label>
                      <Input type="number" defaultValue="50" className="h-12 rounded-xl border-border/50" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                       <div>
                         <p className="font-bold text-red-700">Mode Maintenance</p>
                         <p className="text-xs text-red-600/70">Désactiver l'accès client</p>
                       </div>
                       <Button variant="destructive" size="sm" className="rounded-lg h-8">Activer</Button>
                    </div>
                 </CardContent>
               </Card>
            </div>
          </TabsContent>

          {/* TRANSACTIONS TAB */}
          <TabsContent value="transactions" className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="font-heading text-xl font-bold">Registre des Flux Financiers</h2>
              <div className="relative w-72">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <Input 
                   placeholder="N° Référence..." 
                   className="pl-10 h-10 rounded-full border-border/50 bg-white"
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                 />
              </div>
            </div>
            <Card className="border-none shadow-premium overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider">Référence</th>
                        <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider">Type / Canal</th>
                        <th className="text-left p-4 font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                        <th className="text-right p-4 font-bold text-muted-foreground uppercase tracking-wider">Montant</th>
                        <th className="text-right p-4 font-bold text-muted-foreground uppercase tracking-wider">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {loading ? (
                        <tr><td colSpan={5} className="p-8 text-center text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Chargement...</td></tr>
                      ) : filteredTx.length === 0 ? (
                        <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Aucune transaction trouvée</td></tr>
                      ) : filteredTx.map(tx => (
                        <tr key={tx.id} className="hover:bg-muted/10 transition-colors">
                          <td className="p-4 text-xs font-mono font-bold text-primary">#{tx.id}</td>
                          <td className="p-4">
                            <p className="font-bold capitalize">{tx.type === 'topup' ? 'Recharge' : tx.type === 'payment' ? 'Paiement Search' : 'Autre'}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                              {tx.user_phone || 'Inconnu'} • {tx.payment_method}
                            </p>
                          </td>
                          <td className="p-4 text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleString('fr-FR')}</td>
                          <td className="p-4 text-right">
                             <span className={`font-bold ${tx.type === 'topup' ? 'text-green-600' : 'text-foreground'}`}>
                               {tx.type === 'topup' ? '+' : '-'}{tx.amount.toLocaleString()} FCFA
                             </span>
                          </td>
                          <td className="p-4 text-right">{statusLabel(tx.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* MODAL EDITION MEDICAMENT */}
      <Dialog open={!!editMed} onOpenChange={(open) => !open && setEditMed(null)}>
        <DialogContent className="max-w-md rounded-2xl p-0 border-none overflow-hidden">
          <div className="bg-primary p-6 text-primary-foreground">
            <DialogTitle className="text-xl font-heading">Modifier le Produit</DialogTitle>
            <p className="text-primary-foreground/70 text-sm">Mise à jour du catalogue global</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Nom commercial</Label>
              <Input value={editMed?.name || ''} onChange={e => setEditMed({...editMed, name: e.target.value})} className="rounded-xl border-border/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Dénomination Commune (DCI)</Label>
              <Input value={editMed?.generic_name || ''} onChange={e => setEditMed({...editMed, generic_name: e.target.value})} className="rounded-xl border-border/50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Catégorie</Label>
                    <Input value={editMed?.category || ''} onChange={e => setEditMed({...editMed, category: e.target.value})} className="rounded-xl border-border/50" />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Dosage</Label>
                    <Input value={editMed?.dosage || ''} onChange={e => setEditMed({...editMed, dosage: e.target.value})} className="rounded-xl border-border/50" />
                </div>
            </div>
          </div>
          <DialogFooter className="p-6 bg-muted/30 gap-2">
            <Button variant="ghost" onClick={() => setEditMed(null)} className="rounded-xl font-bold">Annuler</Button>
            <Button onClick={handleUpdateMedication} className="gradient-primary text-white rounded-xl font-bold px-6">
                Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Créditer le portefeuille */}
      <Dialog open={!!creditUser} onOpenChange={v => !v && setCreditUser(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl border-none shadow-premium">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="font-heading text-lg">Créditer le portefeuille</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                {creditUser?.first_name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-bold text-foreground">{creditUser?.first_name} {creditUser?.last_name}</p>
                <p className="text-xs text-muted-foreground">Solde actuel : {(creditUser?.wallet_balance || 0).toLocaleString()} FCFA</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Montant (FCFA)</Label>
              <Input type="number" min="1" placeholder="Ex: 1000" value={creditAmount} onChange={e => setCreditAmount(e.target.value)} className="rounded-xl border-border/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Motif (optionnel)</Label>
              <Input placeholder="Ex: Bonus, remboursement..." value={creditReason} onChange={e => setCreditReason(e.target.value)} className="rounded-xl border-border/50" />
            </div>
          </div>
          <DialogFooter className="p-6 bg-muted/30 gap-2">
            <Button variant="ghost" onClick={() => setCreditUser(null)} className="rounded-xl font-bold">Annuler</Button>
            <Button onClick={handleCreditWallet} disabled={!creditAmount || Number(creditAmount) <= 0} className="gradient-primary text-white rounded-xl font-bold px-6">
              <Wallet className="w-4 h-4 mr-2" /> Créditer {creditAmount ? `${Number(creditAmount).toLocaleString()} FCFA` : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
