import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';

import { Car, cars as cars_list } from './cars';

(async () => {
  let cars:Car[]  = cars_list;

  //Create an express applicaiton
  const app = express(); 
  //default port to listen
  const port = 8082; 
  
  //use middleware so post bodies 
  //are accessable as req.body.{{variable}}
  app.use(bodyParser.json()); 

  // Root URI call
  app.get( "/", ( req: Request, res: Response ) => {
    res.status(200).send("Welcome to the Cloud!");
  } );

  // Get a greeting to a specific person 
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get( "/persons/:name", 
    ( req: Request, res: Response ) => {
      let { name } = req.params;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get( "/persons/", ( req: Request, res: Response ) => {
    let { name } = req.query;

    if ( !name ) {
      return res.status(400)
                .send(`name is required`);
    }

    return res.status(200)
              .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as 
  // an application/json body to {{host}}/persons
  app.post( "/persons", 
    async ( req: Request, res: Response ) => {

      const { name } = req.body;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

    app.get("/cars/",
        async (req: Request, res: Response) => {
            const {make} = req.query;
            const filtered_cars = cars_list.filter(car => (car.make === make || make == undefined));
            return res.status(200).send(filtered_cars);
    });

    app.get("/cars/:id",
        async (req: Request, res: Response) => {
            const {id} = req.params;
            const filtered_cars = cars_list.filter(car => (car.id == id));
            if (filtered_cars.length === 0) {
                return res.status(404).send('');
            }
            return res.status(200).send(filtered_cars[0]);
        });

    app.post("/cars/",
        async (req: Request, res: Response) => {
            const {id, type, model, cost} = req.body;
            if (null == (id || type || model || cost) ) {
                return res.status(400).send("Missing input");
            }
            cars_list.push( { make: 'Unknown', type: type, model: model, cost: cost, id: id });
            return res.status(200).send(`${id}`);
        });


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();