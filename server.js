import app from './src/app.js';
import User from './src/models/User.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});