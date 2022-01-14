import React, { useEffect } from "react";
import * as THREE from "three/build/three.module";
import PaddleSceneJson from "./scene.json";

/**
 * AnimatedLogo component in QuickHit.
 */
function AnimatedLogo(): JSX.Element {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let camera: any, scene: any, renderer: any;

    function init(): void {
        camera = new THREE.PerspectiveCamera(70, 400 / 150, 0.01, 10);
        camera.position.x = 0;
        camera.position.y = 0.75;
        camera.position.z = 0;
        scene = new THREE.ObjectLoader().parse(PaddleSceneJson);
        scene.getObjectByName("Group").position.x = 0;
        scene.getObjectByName("Group").position.z = -3.5;

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(400, 150);
        renderer.setAnimationLoop(animation);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
		const useless3DDiv = document.getElementById("useless3D");
        if (useless3DDiv) {
            useless3DDiv.appendChild(renderer.domElement);
        }
    }

    function animation(time: number): void {
        scene.getObjectByName("Group").rotation.y = time / 3000;
        renderer.render(scene, camera);
    }

    useEffect(() => {
        init();
    }, []);

    return <div id={"useless3D"} />;
}

export default AnimatedLogo;
