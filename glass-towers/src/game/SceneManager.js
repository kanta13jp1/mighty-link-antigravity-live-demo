import * as THREE from 'three';

export class SceneManager {
  constructor(container) {
    this.container = container;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070913);
    this.scene.fog = new THREE.FogExp2(0x070913, 0.02);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.targetCameraPos = new THREE.Vector3(0, 6, 14);
    this.targetLookAt = new THREE.Vector3(0, 2, 0);
    this.camera.position.copy(this.targetCameraPos);
    this.camera.lookAt(this.targetLookAt);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    container.appendChild(this.renderer.domElement);

    // Setup Lights & Pedestal
    this.setupLights();
    this.setupPedestal();

    // Resize Handler
    window.addEventListener('resize', () => this.onWindowResize());
  }

  setupLights() {
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Key Light (Directional with Shadows)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(6, 15, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.camera.left = -8;
    keyLight.shadow.camera.right = 8;
    keyLight.shadow.camera.top = 15;
    keyLight.shadow.camera.bottom = -5;
    keyLight.shadow.bias = -0.0005;
    this.scene.add(keyLight);
    this.keyLight = keyLight;

    // Rim Accent Light Cyan
    const rimCyan = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimCyan.position.set(-10, 8, -6);
    this.scene.add(rimCyan);

    // Rim Accent Light Rose
    const rimRose = new THREE.DirectionalLight(0xf43f5e, 0.8);
    rimRose.position.set(8, -2, -5);
    this.scene.add(rimRose);
  }

  setupPedestal() {
    const halfWidth = 1.6;
    const halfHeight = 0.5;

    const geom = new THREE.BoxGeometry(halfWidth * 2, halfHeight * 2, halfWidth * 2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.2,
      metalness: 0.8
    });

    const pedestalMesh = new THREE.Mesh(geom, mat);
    pedestalMesh.position.set(0, -halfHeight, 0);
    pedestalMesh.receiveShadow = true;
    pedestalMesh.castShadow = true;
    this.scene.add(pedestalMesh);

    // Gold Rim Outline
    const edgeGeom = new THREE.EdgesGeometry(geom);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xfbbf24, linewidth: 2 });
    const edgeLines = new THREE.LineSegments(edgeGeom, edgeMat);
    pedestalMesh.add(edgeLines);

    this.pedestalMesh = pedestalMesh;
  }

  updateCameraTarget(towerHeight) {
    const currentPeak = Math.max(towerHeight, 0);
    const desiredY = Math.max(currentPeak * 0.7 + 6, 6);
    const desiredLookY = Math.max(currentPeak * 0.6 + 1.5, 1.5);

    this.targetCameraPos.set(0, desiredY, 14);
    this.targetLookAt.set(0, desiredLookY, 0);

    // Move key light up with tower
    if (this.keyLight) {
      this.keyLight.position.y = desiredY + 9;
      this.keyLight.target.position.set(0, desiredLookY, 0);
      this.keyLight.target.updateMatrixWorld();
    }
  }

  render() {
    // Smooth camera lerp
    this.camera.position.lerp(this.targetCameraPos, 0.05);
    
    // Smooth lookAt target lerp
    const currentLookAt = new THREE.Vector3();
    this.camera.getWorldDirection(currentLookAt);
    this.camera.lookAt(this.targetLookAt);

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
