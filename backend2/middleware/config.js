import cors from 'cors';
import express from 'express';

// Middleware setup function
const setupMiddleware = (app) => {
  // Enable CORS for all origins
  app.use(cors());

  // Parse JSON bodies (application/json)
  app.use(express.json());

  // Parse URL-encoded bodies (form submissions)
  app.use(express.urlencoded({ extended: true }));

};

export default setupMiddleware;
