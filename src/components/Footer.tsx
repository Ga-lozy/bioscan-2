import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Instagram</h3>
          <a href="https://www.instagram.com/projeto_bioscan" target="_blank" rel="noopener noreferrer">
            @projeto_bioscan
          </a>
        </div>

        <div className="footer-section">
          <h3>Contato</h3>
          <p>Email: contato@projeto.com</p>
        </div>

        <div className="footer-section">
          <h3>Links Úteis</h3>
          <ul>
            <li>
              <Link href="/about">Sobre Nós</Link>
            </li>
            <li>
              <Link href="/termos">Termos de Uso</Link>
            </li>
            <li>
              <Link href="/privacidade">Política de Privacidade</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} BioScan. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
