import React, { useEffect } from "react";
import * as THREE from "three/build/three.module";
import TextSprite from '@seregpie/three.text-sprite';
import PodiumSceneJson from "./scene.json";
import {DbPlayer} from "../../../types/database/models";

interface PodiumProps {
    players: DbPlayer[]
}

/**
 * Podium component in QuickHit.
 */
function Podium(props: PodiumProps): JSX.Element {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let camera: any, scene: any, renderer: any;


    function init(): void {
        const sortedPlayers = props.players.sort((player1, player2) => {
            return player2.elo - player1.elo;
        });

        scene = new THREE.ObjectLoader().parse(PodiumSceneJson);
        camera = scene.getObjectByName("PerspectiveCamera");
        camera.position.z = camera.position.z + 2;

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(550, 500);
        renderer.setAnimationLoop(animation);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        scene.add()

        const firstPlaceSprite = new THREE.TextGeometry({
            font: 10,

            size: 20,
            height: 10,
            curveSegments: 4,

            bevelThickness: 3,
            bevelSize: 2,
            bevelEnabled: true
        });

        firstPlaceSprite.computeBoundingBox();
        firstPlaceSprite.computeVertexNormals();

        const textMesh1 = new THREE.Mesh( firstPlaceSprite );
        textMesh1.position.x = scene.getObjectByName("PerspectiveCamera").position.x;
        textMesh1.position.y = scene.getObjectByName("PerspectiveCamera").position.y;
        textMesh1.position.z = scene.getObjectByName("PerspectiveCamera").position.z + 1;

        scene.add(textMesh1)

        const secondPlaceSprite = new TextSprite({
            text: sortedPlayers[1].name,
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: 12,
            color: '#ffbbff',
        });


        const thirdPlaceSprite = new TextSprite({
            text: sortedPlayers[2].name,
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: 2,
            color: '#ffbbff',
        });

       // firstPlaceSprite.position = scene.getObjectByName("Group").position
       // firstPlaceSprite.position = scene.getObjectByName("Group").position
        // secondPlaceSprite.position = scene.getObjectByName("Second").position;
        // thirdPlaceSprite.position = scene.getObjectByName("Third").position;

        // scene.add(firstPlaceSprite);

        const useless3DDiv = document.getElementById("useless3D");
        if (useless3DDiv) {
            useless3DDiv.appendChild(renderer.domElement);
        }

        renderer.render(scene, camera);
    }

    function animation(time: number): void {
        if (time < 10000) {
            scene.getObjectByName("PerspectiveCamera").position.z -= time * 0.000001;
            scene.getObjectByName("PerspectiveCamera").position.y += time * 0.0000001;

        } else if (time < 40000) {
            scene.getObjectByName("PerspectiveCamera").position.z += time * 0.0000001;
        }
        renderer.render(scene, camera);
    }

    useEffect(() => {
        if (props.players.length > 1) {
            init();
        }
    }, [props.players]);

    return <div id={"useless3D"} />;
}

export default Podium;
