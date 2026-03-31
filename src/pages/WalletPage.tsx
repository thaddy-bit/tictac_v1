import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Smartphone, Loader2, CheckCircle2, History } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Transaction } from '@/types';

export default function WalletPage() {
  const { user, updateWallet } = useAuth();
  const { toast } = useToast();
  const [topupOpen, setTopupOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');
  const [topupMethod, setTopupMethod] = useState<'mtn' | 'airtel'>('mtn');
  const [topupPhone, setTopupPhone] = useState(user?.phone || '');
  const [topupStep, setTopupStep] = useState<'form' | 'processing' | 'done'>('form');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await api.get<any[]>('/users/transactions');
      setTransactions(data);
    } catch (error) {
      console.error('Fetch transactions error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopup = async () => {
    if (!topupAmount || !topupPhone) return;
    
    setTopupStep('processing');
    try {
      const response = await api.post<{ transaction_id: number }>('/payments/wallet/topup', {
        amount: Number(topupAmount),
        phone: topupPhone,
        payment_method: topupMethod
      });

      // Polling pour le statut
      pollRef.current = setInterval(async () => {
        try {
          const statusRes = await api.get<{ status: 'completed' | 'failed' | 'pending' }>(`/payments/status/${response.transaction_id}`);
          if (statusRes.status === 'completed') {
            if (pollRef.current) clearInterval(pollRef.current);
            pollRef.current = null;
            updateWallet(Number(topupAmount));
            setTopupStep('done');
            fetchTransactions();
          } else if (statusRes.status === 'failed') {
            if (pollRef.current) clearInterval(pollRef.current);
            pollRef.current = null;
            setTopupStep('form');
            toast({ title: 'Échec', description: 'Le paiement a été rejeté ou a échoué.', variant: 'destructive' });
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }, 3000);

      // Timeout après 2 minutes
      setTimeout(() => {
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
        if (topupStep === 'processing') {
          setTopupStep('form');
          toast({ title: 'Délai dépassé', description: 'La transaction a mis trop de temps à répondre.' });
        }
      }, 120000);

    } catch (error: any) {
      setTopupStep('form');
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    }
  };

  const resetTopup = () => {
    setTopupOpen(false);
    setTopupStep('form');
    setTopupAmount('');
  };

  const statusLabel = (s: string) => {
    switch (s) {
      case 'completed': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Terminé</Badge>;
      case 'pending': return <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-none">En cours</Badge>;
      case 'failed': return <Badge variant="destructive" className="bg-red-100 text-red-700 border-none">Échoué</Badge>;
      default: return <Badge variant="outline">{s}</Badge>;
    }
  };

  const typeLabel = (t: string) => {
    switch (t) {
      case 'topup': return 'Recharge';
      case 'payment': return 'Paiement Search';
      case 'refund': return 'Remboursement';
      default: return t;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1 max-w-2xl">
        {/* Balance */}
        <Card className="gradient-primary text-primary-foreground mb-8 border-none shadow-glow">
          <CardContent className="p-8 text-center">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <Wallet className="w-12 h-12 mx-auto mb-3 opacity-80" />
              <p className="text-sm opacity-80 font-medium uppercase tracking-wider">Solde disponible</p>
              <p className="text-5xl font-heading font-bold mt-2">{(user?.wallet_balance || 0).toLocaleString()} <span className="text-xl">FCFA</span></p>
              <Button variant="secondary" className="mt-6 h-11 px-8 rounded-xl font-bold text-primary shadow-lg" onClick={() => setTopupOpen(true)}>
                <ArrowUpCircle className="w-5 h-5 mr-2" /> Recharger le compte
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Historique des transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary opacity-50 mb-3" />
                <p className="text-sm text-muted-foreground">Chargement de votre historique...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <History className="w-10 h-10 mx-auto mb-3 opacity-10" />
                <p>Aucune transaction enregistrée</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {transactions.map(tx => (
                  <div key={tx.id} className="p-5 flex items-center justify-between hover:bg-muted/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'topup' ? 'bg-green-100' : 'bg-primary/10'}`}>
                        {tx.type === 'topup' ? <ArrowUpCircle className="w-5 h-5 text-green-600" /> : <ArrowDownCircle className="w-5 h-5 text-primary" />}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{typeLabel(tx.type)}</p>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">
                          {tx.payment_method || 'Système'} · {new Date(tx.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${tx.type === 'topup' ? 'text-green-600' : 'text-foreground'}`}>
                        {tx.type === 'topup' ? '+' : '-'}{tx.amount.toLocaleString()} <span className="text-[10px]">FCFA</span>
                      </p>
                      {statusLabel(tx.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top-up dialog */}
      <Dialog open={topupOpen} onOpenChange={v => !v && resetTopup()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Recharger le portefeuille</DialogTitle>
          </DialogHeader>
          {topupStep === 'form' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Montant (FCFA)</Label>
                <Input type="number" placeholder="5000" value={topupAmount} onChange={e => setTopupAmount(e.target.value)} />
                <div className="flex gap-2">
                  {[1000, 2000, 5000, 10000].map(a => (
                    <Button key={a} variant="outline" size="sm" onClick={() => setTopupAmount(String(a))}>{a.toLocaleString()}</Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Méthode</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setTopupMethod('mtn')}
                    className={`p-3 rounded-lg border-2 text-sm font-medium flex items-center gap-2 transition-colors ${topupMethod === 'mtn' ? 'border-warning bg-warning/5' : 'border-border'}`}>
                    <Smartphone className="w-4 h-4" /> MTN MoMo
                  </button>
                  <button onClick={() => setTopupMethod('airtel')}
                    className={`p-3 rounded-lg border-2 text-sm font-medium flex items-center gap-2 transition-colors ${topupMethod === 'airtel' ? 'border-destructive bg-destructive/5' : 'border-border'}`}>
                    <Smartphone className="w-4 h-4" /> Airtel Money
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Numéro de téléphone</Label>
                <Input placeholder="+242 06 XXX XXXX" value={topupPhone} onChange={e => setTopupPhone(e.target.value)} />
              </div>
              <Button className="w-full gradient-primary text-primary-foreground" onClick={handleTopup}
                disabled={!topupAmount || !topupPhone}>
                Recharger {topupAmount ? `${Number(topupAmount).toLocaleString()} FCFA` : ''}
              </Button>
            </div>
          )}
          {topupStep === 'processing' && (
            <div className="py-8 flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-muted-foreground">Confirmez le paiement sur votre téléphone...</p>
            </div>
          )}
          {topupStep === 'done' && (
            <div className="py-8 flex flex-col items-center gap-4">
              <CheckCircle2 className="w-14 h-14 text-success" />
              <p className="font-medium text-foreground">Recharge réussie !</p>
              <p className="text-sm text-muted-foreground">+{Number(topupAmount).toLocaleString()} FCFA ajoutés à votre portefeuille</p>
              <Button className="gradient-primary text-primary-foreground" onClick={resetTopup}>Fermer</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
