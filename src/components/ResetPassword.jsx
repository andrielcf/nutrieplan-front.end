import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/password/reset', {
                token,
                newPassword,
            });
            setMessage('Senha redefinida com sucesso!');
        } catch (err) {
            setMessage('Erro ao redefinir a senha. Token inválido ou expirado.');
        }
    };

    return (
        <div>
            <h2>Redefinir Senha</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Nova senha"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button type="submit">Redefinir</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
