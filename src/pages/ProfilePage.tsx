import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, Mail, Phone, Calendar, Wallet, 
  Bell, Receipt, Shield, LogOut, Package, 
  ChevronRight, Trash2, ArrowUpRight, ArrowDownLeft,
  Clock, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeAlerts, setActiveAlerts] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ search_count: 0 });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Support state
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [txData, notifData, statsData] = await Promise.all([
          api.get('/users/transactions'),
          api.get('/users/notifications'),
          api.get('/users/history') // used to count searches
      ]);
      setTransactions(txData as any[]);
      setNotifications(notifData as any[]);
      setStats({ search_count: (statsData as any[]).length });
    } catch (error) {
      console.error('Fetch profile data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeAlert = (medName: string) => {
    const newAlerts = activeAlerts.filter(a => a !== medName);
    setActiveAlerts(newAlerts);
    localStorage.setItem('tictac_stock_alerts', JSON.stringify(newAlerts));
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await api.post('/users/security/password', { currentPassword, newPassword });
          toast({ title: 'Succès', description: 'Mot de passe modifié avec succès' });
          setCurrentPassword('');
          setNewPassword('');
      } catch (err: any) {
          toast({ title: 'Erreur', description: err.message || 'Échec de la modification', variant: 'destructive' });
      }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
          await api.post('/users/support', { subject: supportSubject, message: supportMessage });
          toast({ title: 'Ticket envoyé', description: 'Notre équipe vous répondra bientôt' });
          setSupportSubject('');
          setSupportMessage('');
      } catch (err: any) {
          toast({ title: 'Erreur', description: 'Échec de l\'envo du ticket', variant: 'destructive' });
      } finally {
          setIsSubmitting(false);
      }
  };

  if (!user) return null;



  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Sidebar: Brief Info */}
          <div className="md:w-1/3 space-y-6">
            <Card className="overflow-hidden border-none shadow-premium">
              <div className="h-24 gradient-primary" />
              <CardContent className="pt-0 -mt-12 text-center relative">
                <div className="w-24 h-24 rounded-full border-4 border-background bg-muted flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
                  <div className="w-full h-full gradient-primary flex items-center justify-center text-primary-foreground text-3xl font-bold">
                    {(user.first_name || user.phone).charAt(0)}
                  </div>
                </div>
                <h2 className="font-heading text-xl font-bold">{user.first_name} {user.last_name || ''}</h2>
                <Badge variant="secondary" className="mt-1">
                  {user.role === 'admin' ? 'Administrateur' : user.role === 'pharmacy' ? 'Pharmacie' : 'Client Particulier'}
                </Badge>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-2xl text-left space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm italic">Membre depuis {user.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}</span>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  className="w-full mt-6 text-destructive hover:bg-destructive/10 gap-2"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4" /> Déconnexion
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground border-none shadow-glow">
              <CardContent className="p-6">
                <p className="text-primary-foreground/70 text-sm font-medium mb-1 uppercase tracking-wider">Solde Actuel</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-3xl font-heading font-bold">{(user.wallet_balance || 0).toLocaleString()}</h3>
                  <span className="text-sm mb-1 opacity-80 font-bold uppercase tracking-tight">FCFA</span>
                </div>
                <Button variant="secondary" className="w-full mt-4 font-bold" onClick={() => (window.location.href = '/wallet')}>
                  Recharger mon compte
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Main Content: Tabs */}
          <div className="md:w-2/3">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm border border-border/50">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="alerts">Alertes</TabsTrigger>
                <TabsTrigger value="history">Flux</TabsTrigger>
                <TabsTrigger value="security">Sécurité</TabsTrigger>
                <TabsTrigger value="support">Support</TabsTrigger>
              </TabsList>

              {/* Tab: Dashboard/Profile Info */}
              <TabsContent value="profile" className="mt-6 space-y-6">
                <Card className="border-none shadow-premium">
                  <CardHeader>
                    <CardTitle className="font-heading">Mon Dashboard</CardTitle>
                    <CardDescription>Vue d'ensemble de votre activité sur TICTAC</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-border/50 bg-white hover:border-primary/30 transition-all text-center">
                      <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold">{stats.search_count}</p>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Recherches</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border/50 bg-white hover:border-primary/30 transition-all text-center">
                      <Bell className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold">{notifications.length}</p>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Notifications</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Notifications */}
              <TabsContent value="alerts" className="mt-6">
                <Card className="border-none shadow-premium bg-white">
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center gap-2">
                      <Bell className="w-5 h-5 text-primary" /> 
                      Mes Notifications
                    </CardTitle>
                    <CardDescription>Alertes système et informations de stock.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {notifications.length === 0 ? (
                      <div className="p-12 text-center text-muted-foreground bg-muted/10">
                        <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>Aucune notification pour le moment.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border/50">
                        {notifications.map(n => (
                          <div key={n.id} className={`flex items-start gap-4 p-4 transition-colors ${!n.is_read ? 'bg-primary/5' : 'hover:bg-muted/5'}`}>
                            <div className={`mt-1 w-2 h-2 rounded-full ${!n.is_read ? 'bg-primary' : 'bg-transparent'}`} />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-foreground">{n.title}</p>
                                <p className="text-sm text-muted-foreground leading-snug">{n.message}</p>
                                <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString('fr-FR')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Transaction History */}
              <TabsContent value="history" className="mt-6">
                <Card className="border-none shadow-premium">
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-primary" /> 
                      Historique des Transactions
                    </CardTitle>
                    <CardDescription>Recharges, paiements et remboursements.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border/50">
                      {loading ? (
                        <div className="p-12 text-center text-muted-foreground">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 opacity-20" />
                          <p>Chargement des transactions...</p>
                        </div>
                      ) : transactions.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground bg-muted/10">
                          <p>Aucune transaction enregistrée.</p>
                        </div>
                      ) : (
                        transactions.map((tx: any) => (
                          <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-muted/5 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                tx.type === 'topup' ? 'bg-green-100' : 'bg-primary/10'
                              }`}>
                                {tx.type === 'topup' ? (
                                  <ArrowUpRight className="w-5 h-5 text-green-600" />
                                ) : (
                                  <ArrowDownLeft className="w-5 h-5 text-primary" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-foreground">
                                  {tx.description || (tx.type === 'topup' ? 'Recharge de compte' : 'Frais de recherche')}
                                </p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  {new Date(tx.created_at).toLocaleDateString('fr-FR')} • {tx.payment_method?.toUpperCase()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold ${tx.type === 'topup' ? 'text-green-600' : 'text-foreground'}`}>
                                {tx.type === 'topup' ? '+' : '-'}{tx.amount.toLocaleString()} FCFA
                              </p>
                              <Badge className={`text-[10px] ${
                                tx.status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 
                                tx.status === 'failed' ? 'bg-red-100 text-red-700 hover:bg-red-100' : 'bg-muted text-muted-foreground'
                              }`}>
                                {tx.status === 'completed' ? 'Complété' : tx.status === 'failed' ? 'Échoué' : 'En attente'}
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

               {/* Tab: Security Settings */}
              <TabsContent value="security" className="mt-6 space-y-6">
                <Card className="border-none shadow-premium bg-white">
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" /> 
                      Modification du mot de passe
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ancien mot de passe</Label>
                            <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="h-11 rounded-xl bg-muted/30" required />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nouveau mot de passe</Label>
                            <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="h-11 rounded-xl bg-muted/30" required />
                        </div>
                        <Button type="submit" className="w-full h-11 rounded-xl gradient-primary text-white font-bold shadow-glow">
                            Mettre à jour la sécurité
                        </Button>
                    </form>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-premium bg-white opacity-60">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="font-bold text-foreground">Double Authentification (2FA)</p>
                            <p className="text-xs text-muted-foreground">Protection par SMS via MTN/Airtel</p>
                        </div>
                        <Badge variant="outline">Bientôt disponible</Badge>
                    </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Support */}
              <TabsContent value="support" className="mt-6">
                  <Card className="border-none shadow-premium bg-white">
                      <CardHeader>
                          <CardTitle className="font-heading">Contacter l'Assistance</CardTitle>
                          <CardDescription>Un problème avec une commande ou un paiement ? Nous sommes là.</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <form onSubmit={handleSupportSubmit} className="space-y-4">
                              <div className="space-y-2">
                                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sujet</Label>
                                  <Input placeholder="Ex: Problème de recharge" value={supportSubject} onChange={e => setSupportSubject(e.target.value)} className="h-11 rounded-xl" required />
                              </div>
                              <div className="space-y-2">
                                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message</Label>
                                  <textarea 
                                    className="w-full min-h-[120px] rounded-xl border border-input bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Détaillez votre demande..."
                                    value={supportMessage}
                                    onChange={e => setSupportMessage(e.target.value)}
                                    required
                                  />
                              </div>
                              <Button type="submit" className="w-full h-12 rounded-xl gradient-primary text-white font-bold" disabled={isSubmitting}>
                                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                  Envoyer ma demande
                              </Button>
                          </form>
                      </CardContent>
                  </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
