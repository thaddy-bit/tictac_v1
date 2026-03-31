import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { 
    Pill, User, LogOut, Wallet, LayoutDashboard, Menu, X, 
    Settings, LucideIcon, ChevronDown, History, HelpCircle, 
    Bell, CheckCircle2 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
        fetchNotifications();
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
      try {
          const data: any = await api.get('/users/notifications');
          setNotifications(data);
          setUnreadCount(data.filter((n: any) => !n.is_read).length);
      } catch (err) {}
  };

  const markAsRead = async (id: number) => {
      try {
          await api.put(`/users/notifications/${id}/read`, {});
          fetchNotifications();
      } catch (err) {}
  };

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img
            src="/LogoVert.png"
            alt="TICTAC"
            className="h-9 md:h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {user?.role === 'user' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/search')}
                  className="hover:bg-primary/5 hover:text-primary transition-colors font-medium"
                >
                  Rechercher
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/support')}
                className="hover:bg-primary/5 hover:text-primary transition-colors font-medium"
              >
                Aide
              </Button>
              
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative hover:bg-white/50 rounded-full border border-border/50">
                          <Bell className="w-5 h-5 text-foreground" />
                          {unreadCount > 0 && (
                              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-white border-2 border-background animate-in zoom-in duration-300">
                                  {unreadCount}
                              </Badge>
                          )}
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-72 mt-2 border-none shadow-premium bg-white p-0" align="end">
                      <div className="p-3 border-b bg-muted/20">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex justify-between items-center">
                              Notifications
                              {unreadCount > 0 && <span className="lowercase font-normal">({unreadCount} nouvelles)</span>}
                          </p>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                          {notifications.length === 0 ? (
                              <div className="p-8 text-center text-xs text-muted-foreground italic">Aucune notification</div>
                          ) : notifications.map(n => (
                              <div key={n.id} onClick={() => markAsRead(n.id)} className={`p-4 border-b flex gap-3 hover:bg-muted/10 cursor-pointer transition-colors relative ${!n.is_read ? 'bg-primary/5' : ''}`}>
                                  <div className={`w-2 h-2 rounded-full absolute top-4 left-1 ${!n.is_read ? 'bg-primary' : 'bg-transparent'}`} />
                                  <div className="space-y-1">
                                      <p className={`text-xs ${!n.is_read ? 'font-bold' : 'text-muted-foreground'}`}>{n.message}</p>
                                      <p className="text-[10px] text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                      <DropdownMenuItem onClick={() => navigate('/profile')} className="p-3 text-center text-xs text-primary font-bold hover:bg-primary/5 cursor-pointer flex justify-center">
                          Voir tout dans mon profil
                      </DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>

              {user?.role === 'user' && (
                <motion.div
                  key={user?.wallet_balance}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/wallet')}
                    className="border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors font-bold"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    {(user?.wallet_balance || 0).toLocaleString()} <span className="text-[10px] ml-0.5">FCFA</span>
                  </Button>
                </motion.div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-auto pl-2 pr-3 py-1 gap-2 rounded-full hover:bg-white/50 backdrop-blur-sm border border-border/50 transition-all">
                    <Avatar className="h-7 w-7 border-2 border-primary/20">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.first_name}`} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {user?.first_name?.substring(0, 1).toUpperCase()}{user?.last_name?.substring(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start leading-none gap-0.5">
                      <span className="text-xs font-bold text-foreground truncate max-w-[100px]">{user?.first_name} {user?.last_name}</span>
                      <span className="text-[10px] text-muted-foreground capitalize">{user?.role}</span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">{user?.first_name} {user?.last_name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer py-2.5">
                    <User className="mr-2 h-4 w-4" />
                    <span>Mon Profil</span>
                  </DropdownMenuItem>
                  {(user?.role === 'user' || user?.role === 'admin') && (
                    <DropdownMenuItem onClick={() => navigate('/history')} className="cursor-pointer py-2.5">
                      <History className="mr-2 h-4 w-4" />
                      <span>Historique</span>
                    </DropdownMenuItem>
                  )}
                  {user?.role === 'user' && (
                    <DropdownMenuItem onClick={() => navigate('/wallet')} className="cursor-pointer py-2.5">
                      <Wallet className="mr-2 h-4 w-4" />
                      <span>Mon Portefeuille</span>
                    </DropdownMenuItem>
                  )}
                  {user?.role === 'pharmacy' && (
                    <DropdownMenuItem onClick={() => navigate('/pharmacy')} className="cursor-pointer py-2.5">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Ma Pharmacie</span>
                    </DropdownMenuItem>
                  )}
                  {user?.role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer py-2.5 text-primary">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Administration</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { logout(); navigate('/'); }} className="cursor-pointer py-2.5 text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Connexion
              </Button>
              <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => navigate('/register')}>
                Inscription
              </Button>
            </>
          )}
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-card p-4 space-y-2 animate-fade-in">
          {isAuthenticated ? (
            <div className="space-y-3 pt-2 pb-2">
              <div className="flex items-center gap-3 px-2 py-3 bg-primary/5 rounded-xl border border-primary/10">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.first_name}`} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {user?.first_name?.substring(0, 1).toUpperCase()}{user?.last_name?.substring(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-bold text-foreground">{user?.first_name} {user?.last_name}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1">
                {user?.role === 'user' && (
                  <Button variant="ghost" className="w-full justify-start py-6 text-sm" onClick={() => { navigate('/search'); setMobileOpen(false); }}>
                    <Pill className="w-4 h-4 mr-3 text-primary" /> Rechercher un médicament
                  </Button>
                )}
                <Button variant="ghost" className="w-full justify-start py-6 text-sm" onClick={() => { navigate('/profile'); setMobileOpen(false); }}>
                  <User className="w-4 h-4 mr-3 text-primary" /> Mon Profil
                </Button>
                {(user?.role === 'user' || user?.role === 'admin') && (
                  <Button variant="ghost" className="w-full justify-start py-6 text-sm" onClick={() => { navigate('/history'); setMobileOpen(false); }}>
                    <History className="w-4 h-4 mr-3 text-primary" /> Mon Historique
                  </Button>
                )}
                {user?.role === 'user' && (
                  <Button variant="ghost" className="w-full justify-start py-6 text-sm" onClick={() => { navigate('/wallet'); setMobileOpen(false); }}>
                    <Wallet className="w-4 h-4 mr-3 text-primary" /> Portefeuille ({(user?.wallet_balance || 0).toLocaleString()} FCFA)
                  </Button>
                )}
                <Button variant="ghost" className="w-full justify-start py-6 text-sm" onClick={() => { navigate('/support'); setMobileOpen(false); }}>
                  <HelpCircle className="w-4 h-4 mr-3 text-primary" /> Besoin d'aide ?
                </Button>
                {user?.role === 'pharmacy' && (
                  <Button variant="ghost" className="w-full justify-start py-6 text-sm" onClick={() => { navigate('/pharmacy'); setMobileOpen(false); }}>
                    <LayoutDashboard className="w-4 h-4 mr-3 text-primary" /> Ma Pharmacie
                  </Button>
                )}
                {user?.role === 'admin' && (
                  <Button variant="ghost" className="w-full justify-start py-6 text-sm" onClick={() => { navigate('/admin'); setMobileOpen(false); }}>
                    <LayoutDashboard className="w-4 h-4 mr-3 text-primary" /> Administration
                  </Button>
                )}
              </div>
              <Separator />
              <Button variant="destructive" className="w-full flex items-center justify-center gap-2 py-6 rounded-xl shadow-lg mt-4" onClick={() => { logout(); navigate('/'); setMobileOpen(false); }}>
                <LogOut className="w-4 h-4" /> Déconnexion
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" className="w-full" onClick={() => { navigate('/login'); setMobileOpen(false); }}>Connexion</Button>
              <Button className="w-full gradient-primary text-primary-foreground" onClick={() => { navigate('/register'); setMobileOpen(false); }}>Inscription</Button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
