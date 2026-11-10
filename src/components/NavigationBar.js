import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, House, UserRound } from 'lucide-react';
import NavButton from '../components/NavigationButton';
import { useFontSize } from '../hooks/FontSize';

export default function NavBar() {
    const navigate = useNavigate();
    const { isLarge } = useFontSize();

    return (
        <footer className="w-full p-4 z-50 bg-white shadow-sm flex-shrink-0">
            <div className="max-w-md mx-auto w-full">
                <div className="grid grid-cols-3 gap-3 w-full">
                    <NavButton icon={MessageCircle} title='Chats' iconSize={isLarge ? 28 : 24 } onClick={() => navigate("/messages")} />
                    {/* <NavButton icon={House} title='Home' iconSize={isLarge ? 28 : 24 } onClick={() => navigate("/")} /> */}
                    <NavButton id="home-button" icon={House} title='Home' iconSize={isLarge ? 28 : 24 } onClick={() => navigate("/home")} />
                    <NavButton id="profile-button" icon={UserRound} title='Me' iconSize={isLarge ? 28 : 24 } onClick={() => navigate("/profile")} />
                </div>
            </div>
        </footer>
    );
}
