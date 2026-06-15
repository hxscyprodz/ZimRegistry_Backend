import express, { Request, Response, Application } from 'express';
import config  from './config/envConfig';
import logger from './services/logger';
import whatsappRoutes from './routes/whatsapp.routes';


const app: Application = express();
const port = config.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use(whatsappRoutes);

//health check
app.get('/health', (req: Request, res: Response) => {
  res.send('ZimRegistry Backend is running with TypeScript!');
});

app.listen(port, () => {
    try{
        logger.info(`[server]: Server is running at http://localhost:${port}`);
    } catch(error: any) {
        logger.error(`Error occured: ${error.message}`);
        process.exit(1);
    }
});

export default app;