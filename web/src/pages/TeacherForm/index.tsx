import React, { useState, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';
import warningIcon from '../../assets/images/icons/warning.svg';
import './styles.css';
import api from '../../services/api';



export const TeacherForm: React.FC = () => {
    // redirecionar rota
    const history = useHistory();

    // estados dos input
    const [name, setName] = useState(''); // iniciando com valor em branco
    const [avatar, setAvatar] = useState(''); // iniciando com valor em branco
    const [whatsapp, setWatsapp] = useState(''); // iniciando com valor em branco
    const [bio, setBio] = useState(''); // iniciando com valor em branco
    const [subject, setSubject] = useState(''); // iniciando com valor em branco
    const [cost, setCost] = useState(''); // iniciando com valor em branco

    const [scheduleItem, setScheduleItem] = useState([
        { week_day: 0, from: '', to: ''}
    ]);

    function addNewScheduleItem() {
        setScheduleItem([
            ...scheduleItem, // ... spreed operator
            { week_day: 0, from: '', to: '' }
        ])
    }

    // atualização do dia da semana e horario
    function setScheduleItemValue(position: number, field: string, value: string){
        const updatedScheduleItem = scheduleItem.map((scheduleitems, index) => {
            
            if (index === position) {
                return {...scheduleitems, [field]: value };
            }

            return scheduleitems;
        });
        
        setScheduleItem(updatedScheduleItem);
    }

    // criação de class no submit do form
    function handleCreateClass(e: FormEvent) {
        e.preventDefault(); // para nao dar reflash

        api.post('classes', {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost: Number(cost),
            schedule: scheduleItem
        }).then(() => {
            alert('Cadastro realizado com sucesso!');

            history.push('/'); // lading page
        }).catch(() => {
            alert('Erro no cadastro!')
        });

    }



    return (
        <div id="page-teacher-form" className="container">
            <PageHeader 
                title="Que incrível que você quer dar aulas."
                description="O primeiro passo é preencher esee formulário de escrição"
            />
            <main>
                <form onSubmit={handleCreateClass}>
                    <fieldset>
                        <legend>Seus dados</legend>

                        <Input 
                            name="name" 
                            label="Nome completo" 
                            value={name} 
                            onChange={(e) => { setName(e.target.value) }}
                        />

                        <Input 
                            name="avatar" 
                            label="Avatar"
                            value={avatar}
                            onChange={(e) => { setAvatar(e.target.value) }}
                        />

                        <Input 
                            name="whatsapp"    
                            label="Whatsapp"
                            value={whatsapp}
                            onChange={ e => setWatsapp(e.target.value)}
                        />
                        
                        <Textarea 
                            name="bio" 
                            label="Biografia"
                            value={bio}
                            onChange={ e => setBio(e.target.value)}
                        />

                    </fieldset>

                    <fieldset>
                        <legend>Sobre a aula</legend>

                        <Select 
                            name="subject" 
                            label="Matéria"
                            value={subject}
                            onChange={ e => setSubject(e.target.value) }
                            options={[
                                { value: 'Artes', label: 'Artes'},
                                { value: 'Biologia', label: 'Biologia'},
                                { value: 'Ciências', label: 'Ciências'},
                                { value: 'Educação física', label: 'Educação física'},
                                { value: 'Física', label: 'Física'},
                                { value: 'Geografia', label: 'Geografia'},
                                { value: 'História', label: 'História'},
                                { value: 'Matemática', label: 'Matemática'},
                                { value: 'Português', label: 'Português'},
                                { value: 'Química', label: 'Química'},
                            ]}
                        />

                        <Input 
                            name="cost" 
                            label="Custo da sua hora por aula"
                            value={cost}
                            onChange={ e => setCost(e.target.value)}
                        />


                    </fieldset>

                    <fieldset>
                        <legend>
                            Horários disponíveis
                            <button type="button" onClick={addNewScheduleItem}>
                            + Novo horário
                            </button>
                        </legend>
                        
                        {scheduleItem.map((scheduleitem, index) => {
                            return (
                                <div key={scheduleitem.week_day} className="schedule-item">
                                    <Select 
                                        name="week_day" 
                                        label="Dia da semana"
                                        value={scheduleitem.week_day}
                                        onChange={ e => setScheduleItemValue(index, 'week_day', e.target.value)}
                                        options={[
                                            { value: '0', label: 'Domingo'},
                                            { value: '1', label: 'Segunda-feira'},
                                            { value: '2', label: 'Terça-feira'},
                                            { value: '3', label: 'Quarta-feira'},
                                            { value: '4', label: 'Quinta-feira'},
                                            { value: '5', label: 'Sexta-feira'},
                                            { value: '6', label: 'Sábado'},
                                        ]}
                                    />
                                    <Input 
                                        name="from" 
                                        label="Das" 
                                        type="time" 
                                        value={scheduleitem.from}
                                        onChange={ e => setScheduleItemValue(index, 'from', e.target.value)}    
                                    />
                                    <Input
                                        name="to" 
                                        label="Até" 
                                        type="time" 
                                        value={scheduleitem.to}
                                        onChange={ e => setScheduleItemValue(index, 'to', e.target.value)}    
                                    />
                                </div>
                            )
                        })}
                    </fieldset>

                    <footer>
                        <p>
                            <img src={warningIcon} alt="Aviso importante"/>
                            importante! <br />
                            Preencha todos os dados
                        </p>

                        <button type="submit">
                            Salvar cadastro
                        </button>
                    </footer>
                </form>    
            </main>
        </div>
    );
};

