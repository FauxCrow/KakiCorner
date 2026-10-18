import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, House, UserRound } from 'lucide-react';
import NavButton from '../components/NavigationButton';

export default function NavBar() {
    const navigate = useNavigate();

    return (
        <footer className="fixed bottom-0 left-0 w-full p-4 z-50">
            <div className="max-w-md mx-auto w-full">
                <div className="grid grid-cols-3 gap-3 w-full">
                    <NavButton icon={MessageCircle} title='Chats' onClick={() => navigate("/messages")} />
                    <NavButton icon={House} title='Home' onClick={() => navigate("/")} />
                    <NavButton icon={UserRound} title='Me' onClick={() => navigate("/profile")} />
                </div>
            </div>
        </footer>
    );
}
