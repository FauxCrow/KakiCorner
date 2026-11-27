import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, House, UserRound } from 'lucide-react';
import NavButton from '../components/NavigationButton';
import { useFontSize } from '../hooks/FontSize';
import { useTranslation } from 'react-i18next';

export default function NavBar() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isLarge } = useFontSize();

    return (
        <footer className="w-full p-4 z-50 bg-white shadow-sm flex-shrink-0">
            <div className="max-w-md mx-auto w-full">
                <div className="grid grid-cols-3 gap-3 w-full">
                    <NavButton icon={MessageCircle} translate="no" title={t('chats')} iconSize={isLarge ? 28 : 24 } onClick={() => navigate("/messages")} />
                    {/* <NavButton icon={House} title='Home' iconSize={isLarge ? 28 : 24 } onClick={() => navigate("/")} /> */}
                    <NavButton id="home-button" icon={House} translate="no" title={t('home')} iconSize={isLarge ? 28 : 24 } onClick={() => navigate("/home")} />
                    <NavButton id="profile-button" icon={UserRound} translate="no" title={t('me')} iconSize={isLarge ? 28 : 24 } onClick={() => navigate("/profile")} />
                </div>
            </div>
        </footer>
    );
}
