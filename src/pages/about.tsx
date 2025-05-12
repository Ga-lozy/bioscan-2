// src/pages/about.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const AboutPage: React.FC = () => {
  return (
    <div className="about-print">
      <div className="about-box">
        <Image src="/logo.png" alt="Logo Bioscan" width={150} height={150} /> {/* Aumentei o tamanho da logo */}
        <h1>Sobre o Projeto Bioscan</h1>
        <p>
          O Bioscan é um projeto inovador que visa monitorar e proteger a vida selvagem através de
          tecnologias avançadas, como câmeras conectadas e análise de dados em tempo real.
        </p>
        <p>
          Nosso objetivo é fornecer ferramentas para pesquisadores e conservacionistas, ajudando a
          preservar espécies ameaçadas e seus habitats.
        </p>
        <h2>Nossa Missão</h2>
        <p>
          Promover a conservação da biodiversidade através da tecnologia, fornecendo dados precisos e
          ferramentas eficazes para a proteção de ecossistemas.
        </p>
        <h2>Nossa Visão</h2>
        <p>
          Ser referência global em soluções tecnológicas para a conservação da vida selvagem,
          contribuindo para um planeta mais sustentável.
        </p>
        <h2>Nossos Valores</h2>
        <ul>
          <li>Sustentabilidade</li>
          <li>Inovação</li>
          <li>Transparência</li>
          <li>Colaboração</li>
        </ul>
        <Link href="/home" className="back-link-button">
          Voltar para a Home
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;