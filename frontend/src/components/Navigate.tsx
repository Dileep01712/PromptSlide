import { useNavigate } from 'react-router-dom';

export const useNavigation = () => {
    const navigate = useNavigate();

    const handleButtonClick = (route: string) => {
        navigate(route);
    };

    return { handleButtonClick };
};

