import express, { Request, Response, Application } from 'express';
import config  from './config/envConfig';
import logger from './services/logger';

const app: Application = express();
const port = config.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req: Request, res: Response) => {
  res.send('ZimRegistry Backend is running with TypeScript!');
});

app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});

export default app;