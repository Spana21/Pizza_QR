import React, { useState } from 'react';
import { ShieldCheck, Lightbulb, FileText, Mail, Phone, GraduationCap } from 'lucide-react';

// Tady si definujeme adresu Workeru (stejná jako v LoginScreen)
const WORKER_URL = "https://anton-databaze.spaniklukas.workers.dev";

function DiplomkaModal({ isOpen, onClose }) {
  const [isAgreed, setIsAgreed] = useState(false);
  const [selectedAge, setSelectedAge] = useState('');

  if (!isOpen) return null;

  const ageGroups = [
    "Méně než 17", "18 - 24", "25 - 34", "35 - 44",
    "45 - 54", "55 - 64", "65 a více"
  ];

  const handleDownload = async () => {
    try {
      // 1. Spuštění stahování souboru
      const link = document.createElement('a');
      link.href = '/informovany_souhlas.pdf'; 
      link.download = 'Informovany_souhlas_ucastnika.pdf'; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 2. Získání identifikátoru školy z URL
      const currentPath = window.location.pathname.replace('/', ''); 
      const schoolId = currentPath !== '' ? currentPath : 'nezadano';

      // 3. Odeslání dat na Worker (pokud je adresa vyplněná a není to jen prázdný text)
      if (WORKER_URL && WORKER_URL !== "") {
        await fetch(`${WORKER_URL}/wtf`, {
          method: 'POST',
          keepalive: true,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            age: selectedAge,
            school: schoolId,
            timestamp: new Date().toISOString() 
          })
        });
        console.log(`Statistika věku odeslána pro školu: ${schoolId}`);
      }
    } catch (err) {
      console.error("Chyba při zpracování:", err);
    } finally {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        <h3>Právě jste se stali součástí simulovaného testování v rámci <strong>diplomové práce</strong>.</h3>
        
        <p className="modal-text">
            <strong> ❗Prosím, na konci stránky naleznete formulář pro vyplnění informace o věkové skupině, která je pro moji práci nejdůležitějším údajem. ❗</strong>
          </p>

        <div className="modal-info-section">
          <p className="modal-text">
            Tato stránka není skutečným přihlašovacím portálem. Jedná se o <strong>bezpečnou simulaci</strong> v rámci výzkumu pro mou diplomovou práci. Prosím, nestrhávejte ani nepoškozujte plakáty – jejich zachování je nezbytné pro účely probíhajícího testování.
          </p>
          
          <div className="security-guarantee">
            <h4><ShieldCheck size={28} color="#34d399" /> Vaše údaje jsou v naprostém bezpečí</h4>
            <p>
              Číslo vaši <strong>karty, platnost ani CVC kód nebyly nikde uloženy ani odeslány</strong>. 
              Tato simulace slouží výhradně k anonymnímu sběru statistik pro vědecké účely. 
            </p>
          </div>
        </div>

          <div className="education-section">
            <h4><Lightbulb size={24} color="#34d399" style={{ verticalAlign: 'middle', marginRight: '10px' }} /> Jak se příště nenechat napálit?</h4>
            <ul className="edu-list">
              <li><strong>Zkontrolujte adresu (URL) po naskenování:</strong> Moderní čtečky QR kódů vám před otevřením ukážou cílovou adresu. Pokud vede na jinou doménu než oficiální (např. <code>platba-parkovne.cz</code> nebo <code>platBra.fun</code>), stránku neotvírejte.</li>
              <li><strong>Fyzická kontrola QR kódu:</strong> Pokud skenujete QR kód na veřejném místě (např. na parkovacím automatu), zkontrolujte, zda se nejedná <strong> o přelepku.</strong> Útočníci často legitimní kód jednoduše přelepí svým podvodným.</li>
              <li><strong>Zkracovače adres:</strong> Buďte extrémně opatrní, pokud QR kód vede na zkrácenou adresu (např. <code>bit.ly</code> nebo <code>tinyurl.com</code>). Oficiální instituce a platební brány zkracovače v QR kódech pro platby nepoužívají.</li>
              <li><strong>Podezřele výhodná nabídka:</strong> Nabídky typu <code>„Zboží zdarma“</code>, <code>„Oběd za 1 Kč“</code> nebo <code>„Exkluzivní sleva jen dnes“</code> mohou být návnadou 
                  vedoucí na podvodnou stránku.</li>
              <li><strong>Neznámý původ plakátu:</strong> hybějící logo společnosti, kontaktní údaje nebo oficiální identifikace organizátora jsou varovným signálem.</li>
            </ul>
          </div>

        {/* --- KONTAKTY --- */}
        <div className="contact-section">
          <div className="contact-card">
            <h5>Ředitelka školy</h5>
            <div className="contact-item">
              <Mail size={16} color="#34d399" />
              <a href="mailto:brych@sszdra-karvina.cz">brych@sszdra-karvina.cz</a>
            </div>
            <div className="contact-item">
              <Phone size={16} color="#34d399" />
              <a href="tel:+420 530 508 980">+420 596 311 773</a>
            </div>
          </div>
          
          <div className="contact-card">
            <h5>Autor výzkumu</h5>
            <div className="contact-item">
              <Mail size={16} color="#34d399" />
              <a href="mailto:lukas.spanik@unob.cz">lukas.spanik@unob.cz</a>
            </div>
            <div className="contact-item">
              <GraduationCap size={16} color="#34d399" />
              <span>rtm. Lukáš Špánik</span>
            </div>
          </div>
        </div>

        <hr className="modal-divider" />

        <div className="age-selection-section">
          <p className="section-title">Pomozte mi s výzkumem: Do jaké věkové skupiny patříte?</p>
          <select 
            className="modal-select"
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value)}
          >
            <option value="" disabled>Vyberte prosím věkovou skupinu...</option>
            {ageGroups.map((age) => (
              <option key={age} value={age}>
                {age} let
              </option>
            ))}
          </select>
        </div>

        <div className="agreement-wrapper">
          <label className="checkbox-container">
            <input 
              type="checkbox" 
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
            />
            Souhlasím se zapojením do anonymního výzkumu
          </label>
        </div>

        <div className="modal-footer">
          <p className="small-note">Kliknutím na tlačítko stáhnete informovaný souhlas a okno se zavře.</p>
          <button 
            onClick={handleDownload} 
            className="close-btn"
            disabled={!isAgreed || !selectedAge} 
          >
            <FileText size={20} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
            Stáhnout dokument a dokončit
          </button>
          
          <p className="github-info" style={{ marginTop: '30px' }}>
            Projekt je plně transparentní a zdrojový kód je dostupný na 
            <a href="https://github.com/Spana21/Pizza_QR" target="_blank" rel="noopener noreferrer" className="github-link"> GitHubu</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DiplomkaModal;