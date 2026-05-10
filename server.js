import app from './src/app.js';
import User from './src/models/User.js';

const PORT = process.env.PORT || 3000;

const seedAdmin = async () => {
    const count = await User.countDocuments({ role: 'admin' });
    if (count === 0) {
        await User.create({
            name: 'Admin',
            email: 'admin@lab.com',
            password: 'admin1234',
            role: 'admin'
        });
        console.log('Admin creado por defecto');
    }
};

app.listen(PORT, async () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    await seedAdmin();
});
