import express from 'express';
import {Request, Response} from 'express';
const app:express.Express = express();

const startTime = Date.now();
app.get('/health', (req: Request, res: Response) => {
    res.json({ message: 'I am alive!',upTime:`${(Date.now()-startTime)/(1000*60)} min` });
});

export default app;
