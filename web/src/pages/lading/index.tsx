import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom' // evitar recarregamento total quando mudar de pagina SPA
import logoImg from '../../assets/images/logo.svg';
import ladingImg from '../../assets/images/landing.svg';

import studyIcon from '../../assets/images/icons/study.svg';
import giveClassesIcon from '../../assets/images/icons/give-classes.svg';
import purbleHeartIcon from '../../assets/images/icons/purple-heart.svg';

import './styles.css';
import api from '../../services/api';


const Landing: React.FC = () => {

    // buscando total conexões
    const [totalConnections, setTotalConnections] = useState(0); // iniciar com valor zero
    useEffect(() => {
        api.get('/connections').then(response => {
            const { total } = response.data;

            setTotalConnections(total);
        })
    }, []);


    return (
        <div id="page-landing">
            <div id="page-landing-content" className="container">
                <div className="logo-container">
                    <img src={logoImg} alt="Proffy"/>
                    <h2>Sua plataforma de estudos online</h2>
                </div>

                <img 
                    src={ladingImg} 
                    alt="Plataforma de estudos" 
                    className="hero-image"
                />

                <div className="buttons-container">
                    <Link to="/study" className="study">
                        <img src={studyIcon} alt="Estudar"/>
                        Estudar
                    </Link>

                    <Link to="/give-classes" className="give-classes">
                        <img src={giveClassesIcon} alt="Dar aulas"/>
                        Dar aulas
                    </Link>
                </div>

                <span className="total-connections">
                    Total de {totalConnections} conexões já realizadas <img src={purbleHeartIcon} alt="Coração roxo"/>
                </span>
            </div>
        </div>
    )
}

export default Landing;