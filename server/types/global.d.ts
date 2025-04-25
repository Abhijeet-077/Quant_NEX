declare global {
  var trainingJobs: Map<string, Promise<any>>;
  
  namespace Express {
    interface Request {
      user?: any;
      userId?: string;
    }
  }
}

export {};
