import { useState } from 'react';
import axios from 'axios';

export default function RequestResetPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/password/request', { email });
            setMessage('Se o e-mail existir, um link será enviado.');
        } catch (err) {
            setMessage('Erro ao tentar enviar o link.');
        }
    };

    return (
        <div>
            <h2>Recuperar Senha</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Enviar link</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
