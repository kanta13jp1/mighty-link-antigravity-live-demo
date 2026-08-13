import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// Color Palette for Translucent Glass Shapes
const GLASS_PALETTE = [
  { name: 'Crystal Cyan', color: 0x38bdf8, icon: '🧊' },
  { name: 'Amethyst Purple', color: 0xa855f7, icon: '🔮' },
  { name: 'Rose Quartz', color: 0xf43f5e, icon: '💎' },
  { name: 'Emerald Green', color: 0x10b981, icon: '🟢' },
  { name: 'Amber Gold', color: 0xf59e0b, icon: '🟡' },
  { name: 'Sapphire Blue', color: 0x6366f1, icon: '🟦' }
];

export function createGlassMaterial(colorHex) {
  return new THREE.MeshPhysicalMaterial({
    color: colorHex,
    transmission: 0.92,
    opacity: 1,
    transparent: true,
    roughness: 0.08,
    metalness: 0.0,
    ior: 1.52,
    thickness: 1.5,
    specularIntensity: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    attenuationColor: new THREE.Color(colorHex),
    attenuationDistance: 2.5
  });
}

export const SHAPE_TYPES = [
  {
    type: 'cube',
    name: 'Crystal Cube',
    icon: '🧊',
    mass: 2.0,
    createGeometry: () => new THREE.BoxGeometry(1.6, 1.6, 1.6),
    createPhysicsShape: () => new CANNON.Box(new CANNON.Vec3(0.8, 0.8, 0.8)),
    height: 1.6
  },
  {
    type: 'pillar',
    name: 'Glass Column',
    icon: '🏛️',
    mass: 1.8,
    createGeometry: () => new THREE.CylinderGeometry(0.7, 0.7, 2.4, 16),
    createPhysicsShape: () => new CANNON.Cylinder(0.7, 0.7, 2.4, 16),
    height: 2.4
  },
  {
    type: 'sphere',
    name: 'Refractive Orb',
    icon: '🔮',
    mass: 1.5,
    createGeometry: () => new THREE.SphereGeometry(1.0, 32, 32),
    createPhysicsShape: () => new CANNON.Sphere(1.0),
    height: 2.0
  },
  {
    type: 'slab',
    name: 'Glass Platter',
    icon: '⬛',
    mass: 3.0,
    createGeometry: () => new THREE.BoxGeometry(2.8, 0.6, 2.8),
    createPhysicsShape: () => new CANNON.Box(new CANNON.Vec3(1.4, 0.3, 1.4)),
    height: 0.6
  },
  {
    type: 'pyramid',
    name: 'Crystal Prism',
    icon: '🔺',
    mass: 1.6,
    createGeometry: () => new THREE.ConeGeometry(1.2, 2.0, 4),
    createPhysicsShape: () => {
      // Cylinder approximation or Cone
      return new CANNON.Cylinder(0.01, 1.2, 2.0, 4);
    },
    height: 2.0
  },
  {
    type: 'lshape',
    name: 'Angled Monolith',
    icon: '📐',
    mass: 2.4,
    createCompoundShape: () => {
      const group = new THREE.Group();
      const mat = createGlassMaterial(0xec4899);
      
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.7, 0.8), mat);
      b1.castShadow = true;
      b1.receiveShadow = true;
      
      const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.5, 0.8), mat);
      b2.position.set(-0.6, 1.1, 0);
      b2.castShadow = true;
      b2.receiveShadow = true;

      group.add(b1, b2);

      const body = new CANNON.Body({ mass: 2.4 });
      body.addShape(new CANNON.Box(new CANNON.Vec3(1.0, 0.35, 0.4)), new CANNON.Vec3(0, 0, 0));
      body.addShape(new CANNON.Box(new CANNON.Vec3(0.4, 0.75, 0.4)), new CANNON.Vec3(-0.6, 1.1, 0));

      return { group, body, height: 1.85 };
    }
  }
];

export function getRandomShapeTemplate() {
  const templateIndex = Math.floor(Math.random() * SHAPE_TYPES.length);
  const paletteIndex = Math.floor(Math.random() * GLASS_PALETTE.length);
  
  const template = SHAPE_TYPES[templateIndex];
  const palette = GLASS_PALETTE[paletteIndex];

  return {
    ...template,
    colorHex: palette.color,
    colorName: palette.name
  };
}

export function buildShapeInstance(template) {
  let mesh;
  let body;
  const height = template.height;

  if (template.createCompoundShape) {
    const comp = template.createCompoundShape();
    mesh = comp.group;
    body = comp.body;
  } else {
    const geom = template.createGeometry();
    const mat = createGlassMaterial(template.colorHex);
    mesh = new THREE.Mesh(geom, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const shape = template.createPhysicsShape();
    body = new CANNON.Body({ mass: template.mass });
    body.addShape(shape);
  }

  return { mesh, body, height, template };
}
