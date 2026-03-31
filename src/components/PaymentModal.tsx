import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Smartphone, Wallet, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

const SEARCH_FEE = 300;

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (transactionId?: number | string) => void;
  medicationName: string;
}

type Method = 'mtn' | 'airtel' | 'wallet';
type Step = 'select' | 'phone' | 'processing' | 'success';

export function PaymentModal({ open, onClose, onSuccess, medicationName }: PaymentModalProps) {
  const { user, updateWallet } = useAuth();
  const [method, setMethod] = useState<Method | null>(null);
  const [step, setStep] = useState<Step>('select');
  const [phone, setPhone] = useState(user?.phone || '+242');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState<number | string | null>(null);

  useEffect(() => {
    if (step === 'success') {
      const timer = setTimeout(() => {
        handleDone();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const reset = () => { 
    setMethod(null); 
    setStep('select'); 
    setPhone(user?.phone || '+242'); 
    setError(null); 
    setTransactionId(null);
  };

  const handleSelect = async (m: Method) => {
    setMethod(m);
    setError(null);
    
    if (m === 'wallet') {
      const balance = Number(user?.wallet_balance || 0);
      if (balance >= SEARCH_FEE) {
        setIsLoading(true);
        setStep('processing');
        try {
          const res: any = await api.post('/payments/initiate', {
            medicament_search: medicationName,
            payment_method: 'wallet',
            phone: user?.phone || '+242060000000'
          });
          
          if (res.status === 'completed') {
            updateWallet(-SEARCH_FEE);
            setTransactionId(res.transaction_id);
            setStep('success');
          }
        } catch (err: any) {
          setError(err.message || "Erreur lors du paiement via portefeuille.");
          setStep('select');
        } finally {
          setIsLoading(false);
        }
      } else {
        setError("Solde insuffisant dans votre portefeuille TICTAC.");
      }
    } else {
      setStep('phone');
    }
  };

  const handlePay = async () => {
    setIsLoading(true);
    setStep('processing');
    setError(null);
    
    try {
      const res: any = await api.post('/payments/initiate', {
        medicament_search: medicationName,
        payment_method: method,
        phone: phone
      });
      
      setTransactionId(res.transaction_id);
      
      // Poll for status
      pollStatus(res.transaction_id);
      
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'initialisation du paiement.");
      setStep('phone');
      setIsLoading(false);
    }
  };

  const pollStatus = async (id: string | number) => {
    const check = async () => {
      try {
        const res: any = await api.get(`/payments/status/${id}`);
        if (res.status === 'completed') {
          setStep('success');
          setIsLoading(false);
          return true;
        } else if (res.status === 'failed') {
          setError("Le paiement a échoué ou a été annulé.");
          setStep('phone');
          setIsLoading(false);
          return true;
        }
        return false;
      } catch (err) {
        console.error("Status check failed", err);
        return false;
      }
    };

    // Poll every 3 seconds for 2 minutes max
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      const done = await check();
      if (done || attempts > 40) {
        clearInterval(interval);
        if (!done) {
          setError("Le délai de confirmation est dépassé.");
          setStep('phone');
          setIsLoading(false);
        }
      }
    }, 3000);
  };

  const handleDone = () => {
    onSuccess(transactionId || undefined);
    reset();
  };

  const handleClose = () => {
    if (step === 'processing') return; // Prevent closing while processing
    onClose();
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {step === 'success' ? 'Paiement réussi !' : 'Débloquer les détails'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {step === 'success' 
              ? 'Votre paiement a été traité et les résultats sont disponibles.' 
              : 'Choisissez un mode de paiement pour voir les stocks disponibles.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Payez <span className="font-semibold text-foreground">{SEARCH_FEE} FCFA</span> pour débloquer les stocks de : <span className="font-semibold text-foreground italic">{medicationName}</span>
            </p>
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-bold animate-shake">
                {error}
              </div>
            )}
            <div className="grid gap-3">
              <button
                onClick={() => handleSelect('mtn')}
                className="flex items-center gap-3 p-4 rounded-lg border-2 border-border hover:border-warning transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="font-medium text-foreground">MTN Mobile Money</p>
                  <p className="text-sm text-muted-foreground">Payer avec MTN MoMo</p>
                </div>
              </button>
              <button
                disabled={true} // Airtel pas encore supporté par le backend momo-service simulé
                onClick={() => handleSelect('airtel')}
                className="flex items-center gap-3 p-4 rounded-lg border-2 border-border opacity-50 cursor-not-allowed text-left"
              >
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Airtel Money</p>
                  <p className="text-sm text-muted-foreground">Bientôt disponible</p>
                </div>
              </button>
              <button
                onClick={() => handleSelect('wallet')}
                className="flex items-center gap-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Portefeuille TICTAC</p>
                  <p className="text-sm text-muted-foreground">Solde: {(Number(user?.wallet_balance) || 0).toLocaleString()} FCFA</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 'phone' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Entrez votre numéro {method === 'mtn' ? 'MTN' : 'Airtel'} pour recevoir la demande de paiement
            </p>
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-bold">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label>Numéro de téléphone</Label>
              <Input
                placeholder="+242 06 XXX XXXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep('select')} disabled={isLoading}>Retour</Button>
              <Button className="flex-1 gradient-primary text-primary-foreground" onClick={handlePay} disabled={phone.length < 8 || isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Payer {SEARCH_FEE} FCFA
              </Button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-8 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground">
              {method === 'wallet' ? 'Déduction en cours...' : 'En attente de confirmation...'}
            </p>
            {method !== 'wallet' && (
              <p className="text-sm text-muted-foreground">Confirmez le paiement sur votre téléphone</p>
            )}
            <p className="text-xs text-muted-foreground italic">Ceci peut prendre quelques instants...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <p className="font-medium text-foreground">Paiement confirmé !</p>
            <p className="text-sm text-muted-foreground text-center line-clamp-2">
              Vous pouvez maintenant voir les pharmacies stockant : <br/><span className="italic font-medium">{medicationName}</span>
            </p>
            <Button className="gradient-primary text-primary-foreground w-full" onClick={handleDone}>
              Voir les résultats
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
