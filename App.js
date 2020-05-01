import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, StatusBar, Alert, TouchableOpacity, Image } from 'react-native';
import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";
import Bird from './Bird';
import Floor from './Floor';
import Physics, { resetPipes, resetnumberofsmaller,getsmaller } from './Physics';
import Constants from './Constants';
import Images from './assets/Images';
import sky from './sky';

export default class App extends Component {
    constructor(props){
        super(props);

        this.state = {
            running: true,
            score: 0,
            size:-10,
        };

        this.gameEngine = null;

        this.entities = this.setupWorld();
    }

    setupWorld = () => {

        const engine = Matter.Engine.create({ enableSleeping: false });
        const world = engine.world;
        world.gravity.y = 0.0;

        const bird = Matter.Bodies.rectangle( Constants.MAX_WIDTH / 2, Constants.MAX_HEIGHT / 2, Constants.BIRD_WIDTH, Constants.BIRD_HEIGHT);

        const floor1 = Matter.Bodies.rectangle(
            Constants.MAX_WIDTH / 2,
            Constants.MAX_HEIGHT - 25,
            Constants.MAX_WIDTH + 4,
            50,
            { isStatic: true }
        );

        const floor2 = Matter.Bodies.rectangle(
            Constants.MAX_WIDTH + (Constants.MAX_WIDTH / 2),
            Constants.MAX_HEIGHT - 25,
            Constants.MAX_WIDTH + 4,
            50,
            { isStatic: true }
        );

        const sky1 = Matter.Bodies.rectangle(
            Constants.MAX_WIDTH / 2,
            50,
            Constants.MAX_WIDTH + 4,
            50,
            { isStatic: true }
        );

        const sky2 = Matter.Bodies.rectangle(
            Constants.MAX_WIDTH + (Constants.MAX_WIDTH / 2),
            50,
            Constants.MAX_WIDTH + 4,
            50,
            { isStatic: true }
        );
        
        Matter.World.add(world, [bird, floor1, floor2,sky1,sky2]);

        Matter.Events.on(engine, 'collisionStart', (event) => {
            const collidedpars = event.pairs;
            if (collidedpars[0].bodyA.label !== "smaller" && collidedpars[0].bodyB.label !== "smaller" ){
                this.state.size += 1;
            } else {
                this.state.size -= 1;
            }
            if (this.state.size > 2) {
                this.gameEngine.dispatch({ type: "game-over"});
            }
        });

        return {
            physics: { engine: engine, world: world },
            floor1: { body: floor1, renderer: Floor },
            floor2: { body: floor2, renderer: Floor },
            bird: { body: bird, pose: 1, renderer: Bird},
        }
    }

    onEvent = (e) => {
        if (e.type === "game-over"){
            this.setState({
                running: false
            });
        }
         else if (e.type === "score") {
            this.setState({
                score: this.state.score + 1
            })
        } 
    }

    reset = () => {
        resetPipes();
        resetnumberofsmaller();
        this.gameEngine.swap(this.setupWorld());
        this.setState({
            running: true,
            score: 0,
            size:0
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
                <GameEngine
                    ref={(ref) => { this.gameEngine = ref; }}
                    style={styles.game}
                    systems={[Physics]}
                    running={this.state.running}
                    onEvent={this.onEvent}
                    entities={this.entities}>
                    <StatusBar hidden={true} />
                </GameEngine>
                <Text style={styles.score}>{this.state.score}</Text>
                <Text style={styles.state}>life {3 - this.state.size}</Text>

                {!this.state.running && <TouchableOpacity style={styles.fullScreenButton} onPress={this.reset}>
                    <View style={styles.fullScreen}>
                        <Text style={styles.gameover}>your score is {this.state.score}</Text>
                        <Text style={styles.gameover}>try again</Text>
                    </View>
                </TouchableOpacity>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: Constants.MAX_WIDTH,
        height: Constants.MAX_HEIGHT
    },
    game: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    gameover: {
        color: 'red',
        fontSize: 48,
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
        opacity: 0.8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    state:{
        position: 'absolute',
        color: 'white',
        fontSize: 50,
        top: 30,
        left: 15,
        textShadowColor: '#444444',
        textShadowOffset: { width: 2, height: 2},
        textShadowRadius: 2,
    },
    score: {
        position: 'absolute',
        color: 'white',
        fontSize: 72,
        top: 50,
        left: Constants.MAX_WIDTH / 2 - 20,
        textShadowColor: '#444444',
        textShadowOffset: { width: 2, height: 2},
        textShadowRadius: 2,
    },
    fullScreenButton: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        flex: 1
    }
});