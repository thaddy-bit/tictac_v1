import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { AlertCircle, Home, RefreshCw, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ErrorPage = () => {
  const navigate = useNavigate();

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
              <div className="absolute inset-0 blur-2xl bg-destructive/20 rounded-full animate-pulse" />
              <div className="relative w-32 h-32 rounded-3xl bg-white shadow-premium flex items-center justify-center border border-destructive/10">
                <AlertCircle className="w-16 h-16 text-destructive" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-3"
          >
            <h2 className="text-3xl font-heading font-bold text-foreground">Une erreur est survenue</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nous sommes désolés, mais une erreur inattendue empêche l'affichage de cette page. Notre équipe technique a été prévenue.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col gap-3"
          >
            <Button 
                onClick={() => window.location.reload()} 
                className="gradient-primary text-primary-foreground h-12 rounded-xl shadow-glow gap-2 font-bold"
            >
              <RefreshCw className="w-4 h-4" /> Actualiser la page
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="h-11 rounded-xl border-border gap-2 text-sm font-semibold"
              >
                <Home className="w-4 h-4" /> Accueil
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/support')}
                className="h-11 rounded-xl border-border gap-2 text-sm font-semibold"
              >
                <HelpCircle className="w-4 h-4" /> Aide
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      
      <footer className="py-8 text-center text-xs text-muted-foreground">
        © 2026 TICTAC — Trouvez vos médicaments au Congo
      </footer>
    </div>
  );
};

export default ErrorPage;
