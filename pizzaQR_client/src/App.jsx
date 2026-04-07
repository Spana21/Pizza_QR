import React, { useState, useEffect } from 'react';
import './App.css';
import DiplomkaModal from './components/BlackWindow.jsx';

const WORKER_URL = "https://anton-databaze.spaniklukas.workers.dev";

export default function PizzeriaCheckout() {

  const [showModal, setShowModal] = useState(false);
  
  const currentPath = window.location.pathname.replace('/', '');
  const schoolId = currentPath !== '' ? currentPath : 'nezadano';

  useEffect(() => {
    if (WORKER_URL) {
      fetch(`${WORKER_URL}/visit?school=${schoolId}`)
        .then(res => console.log("Návštěva odeslána pro:", schoolId))
        .catch(err => console.error("Chyba při odesílání návštěvy:", err));
    }
  }, [schoolId]);

  const [formData, setFormData] = useState({
    jmeno: '',
    prijmeni: '',
    email: '',
    telefon: '',
    zpusobPlatby: 'karta',
    cardNumber: '',
    expiry: '',
    cvc: '',
    souhlasNovinky: false,
    souhlasPodminky: false
  });

  const [cardType, setCardType] = useState('unknown');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setError('');
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (name === 'cardNumber') {
      let numbersOnly = newValue.replace(/\D/g, ''); 
      
      if (numbersOnly.startsWith('4')) setCardType('visa');
      else if (numbersOnly.startsWith('5')) setCardType('mastercard');
      else setCardType('unknown');

      newValue = numbersOnly.replace(/(.{4})/g, '$1 ').trim();
    }

    if (name === 'expiry') {
      let numbersOnly = newValue.replace(/\D/g, '');
      if (numbersOnly.length > 2) {
        newValue = numbersOnly.substring(0, 2) + '/' + numbersOnly.substring(2, 4);
      } else {
        newValue = numbersOnly;
      }
    }

    if (name === 'cvc') {
      newValue = newValue.replace(/\D/g, '');
    }

    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Číslo karty (musí mít 16 čísel, bez mezer)
    const cleanCard = formData.cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 16) {
      setError("Zadejte platné 16místné číslo platební karty.");
      return; 
    }

    // Platnost (musí mít 5 znaků: MM/RR)
    if (formData.expiry.length !== 5) {
      setError("Zadejte platnost karty ve formátu MM/RR (např. 11/28).");
      return;
    }

    // CVC (musí mít 3 čísla)
    if (formData.cvc.length !== 3) {
      setError("Zadejte 3místný CVC kód ze zadní strany karty.");
      return;
    }

    // E-mail (jednoduchá kontrola zavináče)
    if (!formData.email.includes('@')) {
      setError("Zadejte platný e-mail.");
      return;
    }

    // POKUD VŠE PROŠLO:
    setError(''); 
 
    fetch(`${WORKER_URL}/track-login-click?school=${schoolId}`).catch(console.error);
    fetch(`${WORKER_URL}/track-modal-view?school=${schoolId}`).catch(console.error);
 
    setShowModal(true);
  };

  return (
    <div className="pizza-wrapper">
      <div className="pizza-container">
        
        {/* TVÉ ČERNÉ OKNO */}
        {showModal && (
        <DiplomkaModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
        />
      )}
        
        {/* --- LOGO A HLAVIČKA --- */}
        <div className="pizza-header">
          <div className="pizza-logo">
            <img 
              src="LogoPizza.png" 
              alt="Logo Pizzerie Zlatá kůrka" 
              className="pizza-header-image" 
            />
            <span className="pizza-subtitle">Pravá italská pizza</span>
          </div>
          <p className="pizza-address">Grohova 5, Brno</p>
        </div>

        {/* --- INFORMAČNÍ BANNER O AKCI --- */}
        <div className="promo-banner">
          <strong>Speciální akce za 25 Kč!</strong>
          <p>Tento kupón platí výhradně na pizzu <b>Margherita</b> nebo <b>Prosciutto</b>. Uplatnění kupónu je možné <b>pouze osobně na naší prodejně</b>.</p>
        </div>

        <form onSubmit={handleSubmit} className="pizza-form">
          
          <div className="form-grid-2">
            <div className="input-group">
              <label>Jméno</label>
              <input type="text" name="jmeno" value={formData.jmeno} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Příjmení</label>
              <input type="text" name="prijmeni" value={formData.prijmeni} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>E-mail</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Telefon</label>
              <input type="tel" name="telefon" value={formData.telefon} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="input-group">
              <label>Způsob platby</label>
              <select name="zpusobPlatby" value={formData.zpusobPlatby} onChange={handleChange}>
                <option value="karta">Platební karta online</option>
              </select>
            </div>
          </div>

          <div className="form-grid-card">
            <div className="input-group">
              <label>Číslo karty</label>
              <div className="card-input-wrapper">
                <div className="card-icon-slot cards">
                  {cardType === 'visa' && <img src="/VisaLogo.svg" alt="VISA" className="card-logo-img dimmed" />}
                  {cardType === 'mastercard' && <img src="/MasterCardLogo.svg" alt="MasterCard" className="card-logo-img dimmed" />}
                </div>
                <input 
                  type="text" 
                  name="cardNumber" 
                  placeholder="Číslo karty" 
                  value={formData.cardNumber} 
                  onChange={handleChange} 
                  maxLength="19" 
                  required 
                />
              </div>
            </div>
            
            <div className="input-group">
              <label>Platnost</label>
              <input 
                type="text" 
                name="expiry" 
                placeholder="MM/RR" 
                value={formData.expiry} 
                onChange={handleChange} 
                maxLength="5" 
                required 
              />
            </div>

            <div className="input-group">
              <label>CVV</label>
              <input 
                type="password" 
                name="cvc" 
                placeholder="CVV" 
                value={formData.cvc} 
                onChange={handleChange} 
                maxLength="3" 
                required 
              />
            </div>
          </div>

          <div className="checkbox-section">
            <label className="custom-checkbox">
              <input 
                type="checkbox" 
                name="souhlasNovinky" 
                checked={formData.souhlasNovinky} 
                onChange={handleChange} 
              />
              <span className="checkmark"></span>
              Nemám zájem o zasílání novinek a speciálních akcí.
            </label>

            <label className="custom-checkbox">
              <input 
                type="checkbox" 
                name="souhlasPodminky" 
                checked={formData.souhlasPodminky} 
                onChange={handleChange} 
                required
              />
              <span className="checkmark"></span>
              Souhlasím s obchodními podmínkami pizzerie a beru na vědomí zásady soukromí.
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-pizza-btn">
            ZAPLATIT KUPÓN (25 KČ)
          </button>

        </form>
      </div>
    </div>
  );
}