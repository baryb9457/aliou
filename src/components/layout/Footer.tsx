import { Mail, Phone, MapPin } from 'lucide-react';
import KamLogo from './KamLogo';
import { businessInfo } from '../../lib/business';

export default function Footer() {
  return (
    <footer className="theme-section-alt border-t theme-divider py-12 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <KamLogo size="sm" textClassName="theme-text" />
          </div>
          <p className="theme-text-muted text-sm leading-relaxed">
            Développeur web, technicien informatique et gestionnaire administratif. Je vous accompagne dans tous vos projets numériques et informatiques.
          </p>
        </div>

        <div>
          <h3 className="theme-text font-semibold mb-4 text-sm uppercase tracking-wider">Services</h3>
          <ul className="space-y-2 theme-text-muted text-sm">
            <li>Développement web</li>
            <li>Support informatique</li>
            <li>Gestion administrative</li>
            <li>Maintenance & dépannage</li>
          </ul>
        </div>

        <div>
          <h3 className="theme-text font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
          <ul className="space-y-3 theme-text-muted text-sm">
            <li className="flex items-center gap-2">
              <Mail size={15} className="theme-brand shrink-0" />
              <span>{businessInfo.email}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="theme-brand shrink-0" />
              <span>{businessInfo.phone}</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={15} className="theme-brand shrink-0" />
              <span>{businessInfo.location}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t theme-divider text-center theme-text-muted text-sm">
        &copy; {new Date().getFullYear()} KAM Services. Tous droits réservés.
      </div>
    </footer>
  );
}
