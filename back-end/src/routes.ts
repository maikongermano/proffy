import express from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';
const routes = express.Router();

const classesController = new ClassesController();
const connectionsController = new ConnectionsController();

/** rota para criar aula */
routes.post('/classes', classesController.create);

/** listar */
routes.get('/classes', classesController.index);

/** Rota para criar conexões */
routes.post('/connections', connectionsController.create);

/** Listar total conexões */
routes.get('/connections', connectionsController.index);

export default routes;