import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

export default function ForgotPassword() {
  const [phone, setPhone] = useState('+242');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await api.post<{ message: string; resetToken?: string }>('/auth/forgot-password', {
        phone: phone.replace(/\s/g, ''),
      });
      toast({
        title: 'Demande enregistrée',
        description: data.message,
      });
      if (data.resetToken) {
        navigate('/reset-password', { state: { token: data.resetToken } });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de traiter la demande.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto shadow-glow">
              <KeyRound className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="font-heading text-2xl">Mot de passe oublié</CardTitle>
            <p className="text-sm text-muted-foreground">
              Indiquez le numéro de téléphone de votre compte client. Si celui-ci est reconnu, vous pourrez définir un nouveau mot de passe.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Numéro de téléphone</Label>
                <Input
                  type="tel"
                  placeholder="+242061234567"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full gradient-primary text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Continuer
              </Button>
              <Button type="button" variant="ghost" className="w-full" asChild>
                <Link to="/login" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Retour à la connexion
                </Link>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
