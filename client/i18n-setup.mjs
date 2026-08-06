import fs from 'fs';
import path from 'path';

const locales = ['en', 'hi', 'kn', 'ta', 'te', 'ml', 'mr', 'gu', 'bn', 'pa', 'or'];
const localesDir = path.join(process.cwd(), 'src', 'locales');

if (!fs.existsSync(localesDir)) {
    fs.mkdirSync(localesDir, { recursive: true });
}

const baseTranslation = {
    common: {
        loading: 'Loading...'
    },
    nav: {
        dashboard: 'Dashboard',
        community: 'Community',
        logout: 'Logout'
    }
};

locales.forEach(loc => {
    const locDir = path.join(localesDir, loc);
    if (!fs.existsSync(locDir)) {
        fs.mkdirSync(locDir, { recursive: true });
    }
    const file = path.join(locDir, 'translation.json');
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify(baseTranslation, null, 2));
    }
});
console.log('Locales generated.');
