import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lock, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenLocked, setTokenLocked] = useState(false);

  useEffect(() => {
    const fromQuery = searchParams.get('token');
    const fromNav = (location.state as { token?: string } | null)?.token;
    const t = fromQuery || fromNav || '';
    if (t) {
      setToken(t);
      setTokenLocked(true);
    }
  }, [searchParams, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ variant: 'destructive', title: 'Mot de passe trop court', description: 'Au moins 6 caractères.' });
      return;
    }
    if (password !== confirm) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Les mots de passe ne correspondent pas.' });
      return;
    }
    if (!token.trim()) {
      toast({ variant: 'destructive', title: 'Lien invalide', description: 'Utilisez le lien reçu après « mot de passe oublié ».' });
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', { token: token.trim(), password });
      toast({ title: 'Mot de passe mis à jour', description: 'Vous pouvez vous connecter avec votre nouveau mot de passe.' });
      navigate('/login');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de réinitialiser le mot de passe.',
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
              <Lock className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="font-heading text-2xl">Nouveau mot de passe</CardTitle>
            <p className="text-sm text-muted-foreground">
              Choisissez un mot de passe sécurisé pour votre compte client.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!tokenLocked && (
                <div className="space-y-2">
                  <Label>Code de réinitialisation</Label>
                  <p className="text-xs text-muted-foreground">
                    Si vous n’avez pas été redirigé depuis « Mot de passe oublié », collez ici le code fourni par le support.
                  </p>
                  <Input
                    type="text"
                    autoComplete="off"
                    placeholder="Collez le code ici"
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    className="text-xs font-mono"
                  />
                </div>
              )}
              {tokenLocked && (
                <p className="text-sm text-muted-foreground rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
                  Code de réinitialisation pris en compte. Définissez votre nouveau mot de passe ci-dessous.
                </p>
              )}
              <div className="space-y-2">
                <Label>Nouveau mot de passe</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label>Confirmer le mot de passe</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button
                type="submit"
                className="w-full gradient-primary text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Enregistrer
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
