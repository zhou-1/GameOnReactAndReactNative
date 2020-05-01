import Matter from "matter-js";
import PipeTop from './PipeTop';
import axe from './axe';
import extra from './extra';
import Constants from "./Constants";

let tick = 0;
let pose = 1;
let pipes = 0;
let numberofboom = 0;

export const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const resetnumberofboom = () => {
    numberofboom = 0;
}

export const resetPipes = () => {
    pipes = 0;
}

export const getgetsmaller = () => {
    return getsmaller;
}

export const generatePipes = () => {
    let topPipeHeight = randomBetween(100, (Constants.MAX_HEIGHT / 2) - 100);
    let bottomPipeHeight = Constants.MAX_HEIGHT - topPipeHeight - Constants.GAP_SIZE;

    let sizes = [topPipeHeight, bottomPipeHeight]

    return sizes;
}

export const addObstacles = (x, world, entities) => {
    let [pipe1Height, pipe2Height] = generatePipes();

    let pipeTopWidth = Constants.PIPE_WIDTH;
    let pipeTopHeight = 25;

    pipe1Height = pipe1Height - pipeTopHeight;

    let obstacle1 = Matter.Bodies.rectangle(
        x,
        pipe1Height + (pipeTopHeight / 2),
        pipeTopWidth,
        pipeTopHeight,
        { isStatic: true}
    );

    pipe2Height = pipe2Height - pipeTopHeight;

    let obstacle2 = Matter.Bodies.rectangle(
        x,
        Constants.MAX_HEIGHT - 50 - pipe2Height - (pipeTopHeight / 2),
        pipeTopWidth,
        pipeTopHeight,
        { isStatic: true}
    );

    let randompip = randomBetween(50,Constants.MAX_HEIGHT - 50);

    // let random = randomBetween(1,10);
    // if (random >=0) {
    //     let extra = Matter.Bodies.circle(
    //         (x - 150),
    //         200,
    //         pipeTopHeight/2,
    //         { isStatic: true,label:"extra"},
    //     );
    //     Matter.World.add(world, [extra]);
    //     entities["extra"] = {
    //         body: extra, renderer: extra, scored: false
    //     }
    //     numberofboom+=1;
    // }

    let obstacle3 = Matter.Bodies.rectangle(
        x,
        randompip,
        pipeTopWidth,
        pipeTopHeight,
        { isStatic: true}
    );
    
    let getsmaller = Matter.Bodies.circle(
        (x - 100),
        randompip + 200,
        pipeTopHeight/2,
        { isStatic: true,label:"smaller"},
    );

    Matter.World.add(world, [obstacle1, obstacle2,obstacle3,getsmaller]);


    entities["pipe" + (pipes + 1) ] = {
        body: obstacle1, renderer: PipeTop, scored: false
    }

    entities["pipe" + (pipes + 2) ] = {
        body: obstacle2, renderer: PipeTop, scored: false
    }

    entities["pipe" + (pipes + 3)] = {
        body: obstacle3, renderer: PipeTop, scored: false
    }
    
    entities["pipe"+(pipes + 4)] = {
        body: getsmaller, renderer: axe, scored: false
    }
    
    pipes += 4;
}

export const shooting = (x, world, entities) => { 
    let boom = Matter.Bodies.circle(
        entities.ufo.body.position.x+50,
        entities.ufo.body.position.y,
        25,
        {isStatic:true ,label:"boom"},
    );
    Matter.World.add(world, [boom]);

    entities["boom"+(numberofboom + 1)] = {
        body: boom, renderer: extra, scored: false
    }

    numberofboom+=1;
}


const Physics = (entities, { touches, time, dispatch }) => {
    let engine = entities.physics.engine;
    let world = entities.physics.world;
    let ufo = entities.ufo.body;
    // let axe = entities.axe.body;
    
    let hadTouches = false;
    touches.filter(t => t.type === "press").forEach(t => {
        if (!hadTouches){
            if (world.gravity.y === 0.0){
                world.gravity.y = 1.2;

                addObstacles((Constants.MAX_WIDTH * 2) - (Constants.PIPE_WIDTH / 2), world, entities);
                addObstacles((Constants.MAX_WIDTH * 3) - (Constants.PIPE_WIDTH / 2), world, entities);
            }

            hadTouches = true;
            Matter.Body.setVelocity( ufo, {
                x: ufo.velocity.x,
                y: -10
            });
        }
        
        shooting((Constants.MAX_WIDTH) - (Constants.PIPE_WIDTH / 2), world, entities);



        if (ufo.position.x > Constants.MAX_WIDTH) {
            Matter.Body.translate(ufo, {x: -Constants.MAX_WIDTH / 2, y: 0});
        };


    });
    

    Matter.Engine.update(engine, time.delta);


    // Matter.Events.on(engine, 'collisionStart', (event) => {
    //     const collidedpars = event.pairs;
    //     if (collidedpars[0].bodyA.label !== "boom" && collidedpars[0].bodyB.label !== "boom" ){
    //         delete(collidedpars[0].bodyA);
    //         delete(collidedpars[0].bodyB);
    //     }

    // });

    Object.keys(entities).forEach(key => {
        if (key.indexOf("pipe") === 0 && entities.hasOwnProperty(key)){
            Matter.Body.translate(entities[key].body, {x: -2, y: 0});

            if (key.indexOf("pipe") !== -1 && parseInt(key.replace("pipe", "")) % 4 === 0 ){
                if (entities[key].body.position.x <= ufo.position.x && !entities[key].scored){
                    entities[key].scored = true;
                    dispatch({ type: "score" });
                }

                if (entities[key].body.position.x <= -1 * (Constants.PIPE_WIDTH / 2)){
                    let pipeIndex = parseInt(key.replace("pipe", ""));
                    delete(entities["pipe" + (pipeIndex - 1)]);
                    delete(entities["pipe" + (pipeIndex - 2) ]);
                    delete(entities["pipe" + (pipeIndex - 3) ]);
                    delete(entities["pipe" + pipeIndex ]);

                    addObstacles((Constants.MAX_WIDTH * 2) - (Constants.PIPE_WIDTH / 2), world, entities);
                }
            } 
        }
            else  if (key.indexOf("boom") === 0) {
                Matter.Body.translate(entities[key].body, {x: 10, y: 0});

                if (entities[key].body.position.x > Constants.MAX_WIDTH-50){
                    delete(entities[key]);
                }

            }            
            else if (key.indexOf("floor") === 0){
            if (entities[key].body.position.x <= -1 * Constants.MAX_WIDTH / 2){
                Matter.Body.setPosition(entities[key].body, { x: Constants.MAX_WIDTH + (Constants.MAX_WIDTH / 2), y: entities[key].body.position.y})
            } else {
                Matter.Body.translate(entities[key].body, {x: -2, y: 0});
            }
        } 
    })

    tick += 1;
    if (tick % 8 === 0){
        pose = pose + 1;
        if (pose > 3){
            pose = 1;
        }
        entities.ufo.pose = pose;
    }

    return entities;
};

export default Physics;
