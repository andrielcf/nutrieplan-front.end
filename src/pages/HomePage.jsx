import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Bem-vindo à área protegida!</h1>
        </div>
    );
}