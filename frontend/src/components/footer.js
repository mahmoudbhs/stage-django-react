import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#E20010] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Colonne Application + Réseaux */}
          <div>
            <h3 className="text-2xl font-bold mb-6">DJEZZY</h3>
            <div className="space-y-4">
              <p className="text-white/80">Suivi des indicateurs de performance réseau en temps réel.</p>
              <div className="flex space-x-4">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Liens utiles */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Navigation</h4>
            <ul className="space-y-3">
              <li><a href="/" className="text-white/80 hover:text-white">KPI</a></li>
              <li><a href="/dashboard" className="text-white/80 hover:text-white">Tableau de bord</a></li>
              <li><a href="#" className="text-white/80 hover:text-white">Importer des données</a></li>
              <li><a href="#" className="text-white/80 hover:text-white">Exporter</a></li>
            </ul>
          </div>

          {/* À propos */}
          <div>
            <h4 className="font-semibold text-lg mb-4">À propos</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/80 hover:text-white">Notre mission</a></li>
              <li><a href="#" className="text-white/80 hover:text-white">L'équipe</a></li>
              <li><a href="#" className="text-white/80 hover:text-white">Support</a></li>
              <li><a href="#" className="text-white/80 hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-white/10 p-2 rounded-full"><Phone className="h-5 w-5" /></div>
                <span className="text-white/80">+213 541 29 60 07</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white/10 p-2 rounded-full"><Mail className="h-5 w-5" /></div>
                <span className="text-white/80">support@Djezzy.dz</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white/10 p-2 rounded-full"><MapPin className="h-5 w-5" /></div>
                <span className="text-white/80">Alger, Algérie</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bas de page */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/80 text-sm">
              © {new Date().getFullYear()}DJEZZY. Tous droits réservés.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-sm text-white/80 hover:text-white">Mentions légales</a>
              <a href="#" className="text-sm text-white/80 hover:text-white">Politique de confidentialité</a>
              <a href="#" className="text-sm text-white/80 hover:text-white">Conditions générales</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;