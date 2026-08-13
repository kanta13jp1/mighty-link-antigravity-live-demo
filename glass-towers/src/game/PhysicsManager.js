import * as CANNON from 'cannon-es';
import { soundManager } from './SoundManager.js';

export class PhysicsManager {
  constructor() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.81, 0);
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    this.world.allowSleep = true;

    // Contact Materials
    this.glassMaterial = new CANNON.Material('glass');
    this.pedestalMaterial = new CANNON.Material('pedestal');

    const glassToGlass = new CANNON.ContactMaterial(
      this.glassMaterial,
      this.glassMaterial,
      {
        friction: 0.45,
        restitution: 0.12,
        contactEquationStiffness: 1e7,
        contactEquationRelaxation: 3
      }
    );

    const glassToPedestal = new CANNON.ContactMaterial(
      this.glassMaterial,
      this.pedestalMaterial,
      {
        friction: 0.6,
        restitution: 0.08
      }
    );

    this.world.addContactMaterial(glassToGlass);
    this.world.addContactMaterial(glassToPedestal);
  }

  addPedestalBody(position, halfExtents) {
    const shape = new CANNON.Box(new CANNON.Vec3(halfExtents.x, halfExtents.y, halfExtents.z));
    const body = new CANNON.Body({
      mass: 0, // Static
      material: this.pedestalMaterial
    });
    body.addShape(shape);
    body.position.copy(position);
    this.world.addBody(body);
    return body;
  }

  addGlassBody(body) {
    body.material = this.glassMaterial;
    
    // Add collision listener for audio response
    body.addEventListener('collide', (e) => {
      const relativeVelocity = e.contact.getImpactVelocityAlongNormal();
      if (relativeVelocity > 0.8) {
        soundManager.playClink(relativeVelocity);
      }
    });

    this.world.addBody(body);
  }

  removeBody(body) {
    this.world.removeBody(body);
  }

  update(deltaTime) {
    // Step simulation with fixed 60Hz delta
    this.world.step(1 / 60, deltaTime, 3);
  }

  reset() {
    // Remove all bodies except pedestal (mass == 0)
    const bodiesToRemove = this.world.bodies.filter((b) => b.mass > 0);
    bodiesToRemove.forEach((b) => this.world.removeBody(b));
  }
}
