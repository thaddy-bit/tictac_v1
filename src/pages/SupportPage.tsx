import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  HelpCircle, MessageCircle, Phone, Mail, 
  ChevronRight, Search, FileText, CreditCard, 
  ShieldCheck, MapPin, ExternalLink
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export default function SupportPage() {
  const faqs = [
    {
      question: "Comment fonctionne la recherche débloquée ?",
      answer: "La recherche débloquée permet d'obtenir en temps réel les prix exacts et les niveaux de stock dans les pharmacies autour de vous. Des frais de 200 FCFA sont appliqués pour couvrir les coûts de synchronisation avec les logiciels d'inventaire des pharmacies."
    },
    {
      question: "Comment recharger mon portefeuille TICTAC ?",
      answer: "Vous pouvez recharger votre compte via MTN Mobile Money ou Airtel Money directement dans la section 'Portefeuille'. Le crédit est instantanément ajouté à votre solde."
    },
    {
      question: "Puis-je commander mes médicaments en ligne ?",
      answer: "TICTAC vous aide actuellement à localiser les médicaments et à comparer les prix. La livraison à domicile sera bientôt disponible dans les prochaines mises à jour."
    },
    {
      question: "Que faire si la pharmacie n'a plus le produit affiché ?",
      answer: "Bien que nos stocks soient synchronisés toutes les 15 minutes, il peut arriver qu'un produit soit vendu juste avant votre arrivée. Dans ce cas, contactez notre support via l'application pour un remboursement de vos frais de recherche."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-primary pt-12 pb-24 text-primary-foreground relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Besoin d'aide ?</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8 text-lg">
            Retrouvez les réponses à vos questions ou contactez notre équipe de support disponible 7j/7.
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Rechercher une solution..." 
              className="h-14 pl-12 rounded-2xl border-none shadow-xl text-foreground focus-visible:ring-white"
            />
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-20 -mb-20 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 -mt-12 flex-1 relative z-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: MessageCircle, label: 'Chat en direct', desc: 'Réponse en moins de 5 min', action: 'Démarrer' },
            { icon: Phone, label: 'Appel Support', desc: '+242 06 500 0000', action: 'Appeler' },
            { icon: Mail, label: 'Email', desc: 'support@tictac.cg', action: 'Écrire' },
          ].map(c => (
            <Card key={c.label} className="border-none shadow-premium hover:scale-105 transition-transform cursor-pointer overflow-hidden">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <c.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-1">{c.label}</h3>
                <p className="text-sm text-muted-foreground mb-4">{c.desc}</p>
                <Button variant="outline" className="w-full rounded-xl border-primary/20 text-primary font-bold">
                  {c.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* FAQ Column */}
          <div className="lg:col-span-8 space-y-8">
            <section>
              <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-primary" /> Questions Fréquentes
              </h2>
              <Card className="border-none shadow-premium bg-white p-2">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="border-none px-4">
                      <AccordionTrigger className="text-left font-bold py-5 hover:no-underline hover:text-primary transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                      {i < faqs.length - 1 && <Separator />}
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            </section>
          </div>

          {/* Guides / Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-2xl font-heading font-bold mb-6">Guides Rapides</h2>
            <div className="space-y-4">
              {[
                { icon: CreditCard, label: 'Gestion des paiements', color: 'text-amber-600' },
                { icon: ShieldCheck, label: 'Sécurité du compte', color: 'text-blue-600' },
                { icon: MapPin, label: 'Géolocalisation', color: 'text-red-600' },
                { icon: FileText, label: 'Conditions Générales', color: 'text-purple-600' },
              ].map(g => (
                <Card key={g.label} className="border-none shadow-sm hover:translate-x-1 transition-transform cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <g.icon className={`w-5 h-5 ${g.color}`} />
                      <span className="font-medium text-sm">{g.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="gradient-primary text-primary-foreground border-none mt-8 overflow-hidden relative">
              <CardContent className="p-8 relative z-10">
                <h3 className="font-heading font-bold text-xl mb-2">Devenir Partenaire ?</h3>
                <p className="text-sm opacity-80 mb-6">Vous gérez une pharmacie et souhaitez rejoindre le réseau TICTAC ?</p>
                <Button variant="secondary" className="w-full font-bold shadow-lg">
                  Espace Pharmacie <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
              {/* Overlay pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                 <div className="grid grid-cols-8 h-full">
                   {Array.from({ length: 32 }).map((_, i) => (
                     <div key={i} className="border border-white/20" />
                   ))}
                 </div>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
