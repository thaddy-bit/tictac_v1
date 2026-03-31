import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [phone, setPhone] = useState('+242');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login(phone, password);
      if (user) {
        toast({ title: 'Bienvenue !', description: 'Connexion réussie.' });

        // Redirection basée sur le rôle
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'pharmacy') {
          navigate('/pharmacy');
        } else {
          navigate('/search');
        }
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Identifiants invalides.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <img
          src="/bg-login.jpeg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/88 via-background/82 to-background/90" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border/60 bg-card/85 backdrop-blur-md shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto shadow-glow">
              <Pill className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="font-heading text-2xl">Connexion</CardTitle>
            <p className="text-sm text-muted-foreground">Accédez à votre compte TICTAC</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Numéro de téléphone</Label>
                <Input
                  type="tel"
                  placeholder="+242 06 000 0000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label>Mot de passe</Label>
                  <Link to="/forgot-password" className="text-xs text-primary font-medium hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full gradient-primary text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Se connecter
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Pas de compte ? <Link to="/register" className="text-primary font-medium hover:underline">S'inscrire</Link>
              </p>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
