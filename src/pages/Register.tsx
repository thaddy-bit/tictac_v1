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

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+242');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'pharmacy'>('user');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await register({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password,
        role
      });
      if (success) {
        toast({ title: 'Compte créé !', description: 'Bienvenue sur TICTAC.' });
        navigate('/search');
      }
    } catch (error: any) {
      toast({ 
        variant: 'destructive', 
        title: 'Erreur', 
        description: error.message || 'Erreur lors de la création du compte.' 
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
          <Card className="w-full max-w-md my-8 border-border/60 bg-card/85 backdrop-blur-md shadow-xl">
            <CardHeader className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto shadow-glow">
                <Pill className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="font-heading text-2xl">Inscription</CardTitle>
              <p className="text-sm text-muted-foreground">Créez votre compte TICTAC</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prénom</Label>
                    <Input placeholder="Jean" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input placeholder="Makaya" value={lastName} onChange={e => setLastName(e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email (Optionnel)</Label>
                  <Input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input placeholder="+242 06 XXX XXXX" value={phone} onChange={e => setPhone(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Mot de passe</Label>
                  <Input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Type de compte</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setRole('user')}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${role === 'user' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'}`}>
                      Utilisateur
                    </button>
                    <button type="button" onClick={() => setRole('pharmacy')}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${role === 'pharmacy' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'}`}>
                      Pharmacie
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full gradient-primary text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Créer mon compte
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Déjà inscrit ? <Link to="/login" className="text-primary font-medium hover:underline">Se connecter</Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
