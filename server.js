import connect from 'connect';
import serveStatic from 'serve-static';

connect()
.use(serveStatic('./'))
.listen(8080, '0.0.0.0', () => console.log('Server running on http://0.0.0.0:8080/'));