import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { SearchX, Home, Search, HelpCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: Accessing non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full animate-pulse" />
              <div className="relative w-32 h-32 rounded-3xl bg-white shadow-premium flex items-center justify-center border border-primary/10">
                <SearchX className="w-16 h-16 text-primary" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-3"
          >
            <h1 className="text-7xl font-heading font-black text-primary/10 absolute -top-12 left-1/2 -translate-x-1/2 select-none">
              404
            </h1>
            <h2 className="text-3xl font-heading font-bold text-foreground">Oups ! Page introuvable</h2>
            <p className="text-muted-foreground leading-relaxed">
              Il semble que le médicament ou la page que vous recherchez n'existe pas ou a été déplacé.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col gap-3"
          >
            <Button 
                onClick={() => navigate('/')} 
                className="gradient-primary text-primary-foreground h-12 rounded-xl shadow-glow gap-2 font-bold"
            >
              <Home className="w-4 h-4" /> Retour à l'accueil
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/search')}
                className="h-11 rounded-xl border-primary/20 gap-2 text-sm font-semibold"
              >
                <Search className="w-4 h-4 text-primary" /> Nouvelle recherche
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/support')}
                className="h-11 rounded-xl border-primary/20 gap-2 text-sm font-semibold"
              >
                <HelpCircle className="w-4 h-4 text-primary" /> Besoin d'aide
              </Button>
            </div>
            
            <button 
                onClick={() => navigate(-1)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 justify-center pt-4"
            >
                <ArrowLeft className="w-3 h-3" /> Revenir à la page précédente
            </button>
          </motion.div>
        </div>
      </main>
      
      <footer className="py-8 text-center text-xs text-muted-foreground">
        © 2026 TICTAC — Trouvez vos médicaments au Congo
      </footer>
    </div>
  );
};

export default NotFound;
