import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Html,
  PerspectiveCamera,
  RoundedBox,
  Sky,
  Text,
  useCursor,
  useGLTF,
} from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { DRACOLoader } from "three-stdlib";
import { buildJourneyScene } from "../data/journeyData";

const publicAssetBase = process.env.PUBLIC_URL || "";
const resolvePublicAssetPath = (assetPath) => `${publicAssetBase}${assetPath}`;
const cityModelPath = resolvePublicAssetPath("/models/city.glb.txt");
const carModelPath = resolvePublicAssetPath("/models/car.glb.txt");
const dracoDecoderPath = resolvePublicAssetPath("/draco/");
const environmentFiles = [
  "/textures/env/px.svg",
  "/textures/env/nx.svg",
  "/textures/env/py.svg",
  "/textures/env/ny.svg",
  "/textures/env/pz.svg",
  "/textures/env/nz.svg",
].map(resolvePublicAssetPath);
const textFontPath = resolvePublicAssetPath(
  "/fonts/franklin-gothic-regular.ttf",
);
const extendGltfLoader = (loader) => {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(dracoDecoderPath);
  dracoLoader.setDecoderConfig({ type: "js" });
  loader.setDRACOLoader(dracoLoader);
};
const cityBasePosition = [0, 0, -80];
const cityRotation = [0, -Math.PI / 2, 0];
const cityScale = 0.7;
const carRotation = [0, Math.PI, 0];
const carScale = 0.004;
const environmentIntensity = 1.15;
const collisionFrontZ = -0.14;
const cardDepth = 0.2;
const hitStopDurationMs = 82;
const fadeOutDurationMs = 280;
const explosionLifetime = 1.65;
const dustLifetime = 0.48;
const rebuildLifetime = 0.82;
const collisionReleaseMargin = 0.26;
const signalLeadDistance = 0.08;
const desktopCardLayout = {
  scale: 1,
  xOffsetMultiplier: 0,
  yOffset: 0,
  width: 4.5,
  height: 3.05,
  accentBarY: 1.68,
  accentBarWidth: 4.5,
  footerStripY: -1.12,
  footerStripWidth: 4.08,
  sideRuleX: -2.18,
  sideRuleHeight: 3.05,
  yearPosition: [-1.48, 0.82, 0.12],
  titlePosition: [-1.48, 0.28, 0.12],
  detailPosition: [-1.48, -0.52, 0.12],
  yearFontSize: 0.34,
  titleFontSize: 0.27,
  detailFontSize: 0.18,
  maxWidth: 3.3,
  cameraPosition: [0, 3.6, 10],
  cameraFov: 40,
};
const mobileCardLayout = {
  scale: 0.74,
  xOffsetMultiplier: 0,
  yOffset: -0.22,
  width: 4.1,
  height: 3.25,
  accentBarY: 1.78,
  accentBarWidth: 4.1,
  footerStripY: -1.18,
  footerStripWidth: 3.64,
  sideRuleX: -1.98,
  sideRuleHeight: 3.25,
  yearPosition: [-1.34, 0.92, 0.12],
  titlePosition: [-1.34, 0.34, 0.12],
  detailPosition: [-1.34, -0.56, 0.12],
  yearFontSize: 0.34,
  titleFontSize: 0.26,
  detailFontSize: 0.18,
  maxWidth: 2.95,
  cameraPosition: [0, 3.6, 10],
  cameraFov: 40,
};
const atmosphereVertexShader = `
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const atmosphereFragmentShader = `
  uniform vec3 topColor;
  uniform vec3 horizonColor;
  uniform vec3 bottomColor;

  varying vec3 vWorldPosition;

  void main() {
    float heightMix = clamp(normalize(vWorldPosition).y * 0.5 + 0.5, 0.0, 1.0);
    vec3 lowerBlend = mix(bottomColor, horizonColor, smoothstep(0.0, 0.45, heightMix));
    vec3 finalColor = mix(lowerBlend, topColor, smoothstep(0.42, 1.0, heightMix));
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function hashString(input) {
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createSeededRandom(seed) {
  let current = seed || 1;

  return () => {
    current = (1664525 * current + 1013904223) >>> 0;
    return current / 4294967296;
  };
}

function randomBetweenWithSource(randomSource, min, max) {
  return min + randomSource() * (max - min);
}

function easeOutCubic(value) {
  return 1 - (1 - value) ** 3;
}

function clamp01(value) {
  return Math.min(Math.max(value, 0), 1);
}

function resolveMilestonePosition(milestone, layout) {
  return [
    milestone.position[0] * layout.xOffsetMultiplier,
    milestone.position[1] + layout.yOffset,
    milestone.position[2],
  ];
}

function sampleFragmentColor(milestone, layout, localX, localY) {
  const backgroundColor = new THREE.Color("#0d5e99");
  const accentColor = new THREE.Color(milestone.accent);
  const sandColor = new THREE.Color("#f9fbff");
  const textColor = new THREE.Color("#e5f2ff");
  const footerColor = accentColor.clone().lerp(backgroundColor, 0.12);
  const topEdge = layout.height * 0.5;
  const bottomEdge = -layout.height * 0.5;

  if (localY > topEdge - 0.2) {
    return accentColor;
  }

  if (localY < bottomEdge + 0.32) {
    return footerColor;
  }

  if (localX < -layout.width * 0.5 + 0.3) {
    return sandColor;
  }

  if (
    localY > layout.yearPosition[1] - 0.14 &&
    localY < layout.yearPosition[1] + 0.16 &&
    localX > layout.yearPosition[0] - 0.15
  ) {
    return accentColor;
  }

  if (
    localY > layout.titlePosition[1] - 0.14 &&
    localY < layout.titlePosition[1] + 0.14 &&
    localX > layout.titlePosition[0] - 0.15
  ) {
    return sandColor;
  }

  if (
    localY > layout.detailPosition[1] - 0.34 &&
    localY < layout.detailPosition[1] + 0.22 &&
    localX > layout.detailPosition[0] - 0.15
  ) {
    return textColor;
  }

  return backgroundColor;
}

function createFragmentBlueprints(
  milestone,
  layout,
  randomSource = Math.random,
) {
  const columns = 14;
  const rows = 10;
  const usableWidth = layout.width - 0.22;
  const usableHeight = layout.height - 0.18;
  const cellWidth = usableWidth / columns;
  const cellHeight = usableHeight / rows;

  return Array.from({ length: columns * rows }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const localX =
      -usableWidth / 2 +
      cellWidth * (column + 0.5) +
      randomBetweenWithSource(
        randomSource,
        -cellWidth * 0.18,
        cellWidth * 0.18,
      );
    const localY =
      usableHeight / 2 -
      cellHeight * (row + 0.5) +
      randomBetweenWithSource(
        randomSource,
        -cellHeight * 0.18,
        cellHeight * 0.18,
      );
    const outward = new THREE.Vector3(
      localX * 0.45 + randomBetweenWithSource(randomSource, -0.55, 0.55),
      localY * 0.38 + randomBetweenWithSource(randomSource, 0.35, 1.35),
      randomBetweenWithSource(randomSource, 2.6, 6.8),
    ).normalize();
    const speed = randomBetweenWithSource(randomSource, 2.8, 8.4);

    return {
      initialPosition: new THREE.Vector3(
        localX,
        localY,
        randomBetweenWithSource(randomSource, -0.04, 0.08),
      ),
      velocity: outward.multiplyScalar(speed),
      rotation: new THREE.Euler(
        randomBetweenWithSource(randomSource, -0.4, 0.4),
        randomBetweenWithSource(randomSource, -0.4, 0.4),
        randomBetweenWithSource(randomSource, -0.4, 0.4),
      ),
      angularVelocity: new THREE.Vector3(
        randomBetweenWithSource(randomSource, -6.4, 6.4),
        randomBetweenWithSource(randomSource, -6.4, 6.4),
        randomBetweenWithSource(randomSource, -6.4, 6.4),
      ),
      size: new THREE.Vector3(
        Math.max(
          cellWidth * randomBetweenWithSource(randomSource, 0.72, 1.08),
          0.12,
        ),
        Math.max(
          cellHeight * randomBetweenWithSource(randomSource, 0.72, 1.08),
          0.12,
        ),
        randomBetweenWithSource(randomSource, 0.08, 0.18),
      ),
      color: sampleFragmentColor(milestone, layout, localX, localY),
    };
  });
}

function createDustBlueprints() {
  return Array.from({ length: 32 }, () => ({
    initialPosition: new THREE.Vector3(
      randomBetween(-0.35, 0.35),
      randomBetween(-0.25, 0.35),
      randomBetween(0.02, 0.2),
    ),
    velocity: new THREE.Vector3(
      randomBetween(-1.1, 1.1),
      randomBetween(0.3, 1.4),
      randomBetween(1.3, 3.1),
    ),
  }));
}

function createRebuildFragmentBlueprints(milestone, layout) {
  const randomSource = createSeededRandom(
    hashString(`${milestone.id}-rebuild`),
  );
  const baseFragments = createFragmentBlueprints(
    milestone,
    layout,
    createSeededRandom(hashString(`${milestone.id}-shatter`)),
  );

  return baseFragments.map((fragment) => {
    const scatterPosition = fragment.initialPosition
      .clone()
      .addScaledVector(
        fragment.velocity,
        randomBetweenWithSource(randomSource, 0.42, 0.72),
      )
      .add(
        new THREE.Vector3(
          randomBetweenWithSource(randomSource, -0.28, 0.28),
          randomBetweenWithSource(randomSource, -1.1, -0.18),
          randomBetweenWithSource(randomSource, 0.8, 1.7),
        ),
      );

    return {
      ...fragment,
      scatterPosition,
      scatterRotation: new THREE.Euler(
        fragment.rotation.x + randomBetweenWithSource(randomSource, -2.4, 2.4),
        fragment.rotation.y + randomBetweenWithSource(randomSource, -2.4, 2.4),
        fragment.rotation.z + randomBetweenWithSource(randomSource, -2.4, 2.4),
      ),
    };
  });
}

function MilestoneCard({
  milestone,
  isActive,
  isHovered,
  onHover,
  onSelect,
  layout,
  opacity = 1,
  positionOverride,
  interactive = true,
}) {
  useCursor(isHovered);
  const cardLift = isActive ? 0.2 : 0;
  const resolvedPosition =
    positionOverride || resolveMilestonePosition(milestone, layout);
  const isTransparent = opacity < 0.999;
  const signBlue = isActive ? "#0f76be" : "#0b5f9d";
  const signBlueInner = isActive ? "#4e89bf" : "#3f7eb6";
  const signBorder = "#f8fbff";
  const postColor = "#b5b5bb";
  const badgeLabel = milestone.eyebrow || "Journey stop";
  const topPanelHeight = layout.height * 0.72;
  const lowerPanelHeight = layout.height * 0.26;
  const lowerPanelWidth = layout.width * 0.96;
  const topPanelY = 0.58 + cardLift;
  const lowerPanelY = -1.1 + cardLift;
  const poleHeight = layout.height * 1.9;
  const poleY = -1.36 + cardLift;
  const poleOffset = layout.width * 0.28;
  const postCapY = topPanelY + topPanelHeight * 0.5 + 0.18;
  const postBaseY = poleY - poleHeight * 0.5 + 0.22;
  const topTextLeft = -layout.width * 0.34;
  const yearY = topPanelY + 0.46;
  const titleY = topPanelY + 0.02;
  const detailY = topPanelY - 0.6;

  return (
    <group
      position={resolvedPosition}
      scale={isActive ? layout.scale * 1.08 : layout.scale}
      onClick={interactive ? onSelect : undefined}
      onPointerOver={interactive ? onHover(true) : undefined}
      onPointerOut={interactive ? onHover(false) : undefined}
    >
      <mesh position={[-poleOffset, poleY, -0.18]}>
        <cylinderGeometry args={[0.08, 0.08, poleHeight, 10]} />
        <meshStandardMaterial
          color={postColor}
          roughness={0.4}
          metalness={0.62}
        />
      </mesh>

      <mesh position={[poleOffset, poleY, -0.18]}>
        <cylinderGeometry args={[0.08, 0.08, poleHeight, 10]} />
        <meshStandardMaterial
          color={postColor}
          roughness={0.4}
          metalness={0.62}
        />
      </mesh>

      <mesh position={[-poleOffset, postCapY, -0.16]}>
        <boxGeometry args={[0.34, 0.24, 0.18]} />
        <meshStandardMaterial
          color="#c8c8ce"
          roughness={0.56}
          metalness={0.18}
        />
      </mesh>

      <mesh position={[poleOffset, postCapY, -0.16]}>
        <boxGeometry args={[0.34, 0.24, 0.18]} />
        <meshStandardMaterial
          color="#c8c8ce"
          roughness={0.56}
          metalness={0.18}
        />
      </mesh>

      <mesh position={[-poleOffset, postBaseY, -0.16]}>
        <boxGeometry args={[0.28, 0.64, 0.2]} />
        <meshStandardMaterial
          color="#c6c6cb"
          roughness={0.62}
          metalness={0.16}
        />
      </mesh>

      <mesh position={[poleOffset, postBaseY, -0.16]}>
        <boxGeometry args={[0.28, 0.64, 0.2]} />
        <meshStandardMaterial
          color="#c6c6cb"
          roughness={0.62}
          metalness={0.16}
        />
      </mesh>

      <RoundedBox
        args={[layout.width + 0.08, topPanelHeight + 0.08, 0]}
        radius={0.22}
        smoothness={4}
        position={[0, topPanelY, -0.01]}
      >
        <meshStandardMaterial
          color={signBorder}
          roughness={0.52}
          metalness={0.08}
          transparent={isTransparent}
          opacity={opacity}
        />
      </RoundedBox>

      <RoundedBox
        args={[layout.width, topPanelHeight, 0.2]}
        radius={0.2}
        smoothness={4}
        position={[0, topPanelY, 0.01]}
      >
        <meshStandardMaterial
          color={signBlue}
          roughness={0.46}
          metalness={0.12}
          envMapIntensity={1.1}
          transparent={isTransparent}
          opacity={opacity}
        />
      </RoundedBox>

      <RoundedBox
        args={[layout.width * 0.92, topPanelHeight * 0.9, 0.05]}
        radius={0.18}
        smoothness={4}
        position={[0, topPanelY, 0.08]}
      >
        <meshBasicMaterial
          color={signBlueInner}
          transparent
          opacity={opacity * 0.14}
        />
      </RoundedBox>

      <RoundedBox
        args={[lowerPanelWidth + 0.05, lowerPanelHeight + 0.05, 0]}
        radius={0.16}
        smoothness={4}
        position={[0, lowerPanelY, -0.01]}
      >
        <meshStandardMaterial
          color={signBorder}
          roughness={0.52}
          metalness={0.08}
          transparent={isTransparent}
          opacity={opacity}
        />
      </RoundedBox>

      <RoundedBox
        args={[lowerPanelWidth, lowerPanelHeight, 0.18]}
        radius={0.15}
        smoothness={4}
        position={[0, lowerPanelY, 0.01]}
      >
        <meshStandardMaterial
          color={signBlue}
          roughness={0.46}
          metalness={0.12}
          transparent={isTransparent}
          opacity={opacity}
        />
      </RoundedBox>

      <Text
        position={[0, lowerPanelY, 0.24]}
        anchorX="center"
        anchorY="middle"
        font={textFontPath}
        fontSize={layout.detailFontSize * 0.8}
        color="#f5f9ff"
        maxWidth={lowerPanelWidth - 0.3}
        fillOpacity={opacity}
      >
        {badgeLabel}
      </Text>

      <Text
        position={[topTextLeft, yearY, 0.24]}
        anchorX="left"
        anchorY="middle"
        font={textFontPath}
        fontSize={layout.yearFontSize}
        color="#f7fbff"
        maxWidth={layout.maxWidth}
        fillOpacity={opacity}
      >
        {milestone.year}
      </Text>
      <Text
        position={[topTextLeft, titleY, 0.24]}
        anchorX="left"
        anchorY="middle"
        font={textFontPath}
        fontSize={layout.titleFontSize}
        color="#ffffff"
        maxWidth={layout.maxWidth}
        fillOpacity={opacity}
      >
        {milestone.title}
      </Text>
      <Text
        position={[topTextLeft, detailY, 0.24]}
        anchorX="left"
        anchorY="middle"
        font={textFontPath}
        fontSize={layout.detailFontSize}
        lineHeight={1.4}
        color={isActive ? "#eff7ff" : "#dceaf7"}
        maxWidth={layout.maxWidth * 0.92}
        fillOpacity={opacity}
      >
        {milestone.detail}
      </Text>
    </group>
  );
}

function RoadSignal({ milestone, layout, signalState = "red" }) {
  const signalX = layout.width * 0.5 + 0.52;
  const signalY = milestone.position[1] + layout.yOffset - 0.55;
  const signalZ = milestone.position[2] + signalLeadDistance;
  const redActive = signalState !== "green";
  const greenActive = signalState === "green";
  const activeLampScale = 1.06;

  return (
    <group position={[signalX, signalY, signalZ]} scale={layout.scale * 0.94}>
      <mesh position={[0, -1.2, -0.04]}>
        <cylinderGeometry args={[0.08, 0.1, 3, 10]} />
        <meshStandardMaterial
          color="#9ca7b3"
          roughness={0.4}
          metalness={0.64}
        />
      </mesh>

      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.86, 1.66, 0.52]} />
        <meshStandardMaterial
          color="#192028"
          roughness={0.56}
          metalness={0.22}
        />
      </mesh>

      <mesh position={[0, 0.9, 0.28]}>
        <sphereGeometry args={[0.21, 12, 12]} />
        <meshBasicMaterial color={redActive ? "#ff4d43" : "#220606"} />
      </mesh>

      {redActive ? (
        <mesh position={[0, 0.9, 0.34]} scale={activeLampScale}>
          <sphereGeometry args={[0.24, 10, 10]} />
          <meshBasicMaterial color="#ff7a72" transparent opacity={0.24} />
        </mesh>
      ) : null}

      <mesh position={[0, 0.16, 0.28]}>
        <sphereGeometry args={[0.21, 12, 12]} />
        <meshBasicMaterial color={greenActive ? "#4ef06f" : "#071a0a"} />
      </mesh>

      {greenActive ? (
        <mesh position={[0, 0.16, 0.34]} scale={activeLampScale}>
          <sphereGeometry args={[0.24, 10, 10]} />
          <meshBasicMaterial color="#82ff9b" transparent opacity={0.24} />
        </mesh>
      ) : null}
    </group>
  );
}

function ImpactFadeCard({ impact, onComplete }) {
  const groupRef = useRef(null);
  const elapsedMsRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return;
    }

    elapsedMsRef.current += delta * 1000;
    const progress = clamp01(elapsedMsRef.current / fadeOutDurationMs);
    const nextOpacity = 1 - easeOutCubic(progress);

    groupRef.current.traverse((node) => {
      if (node.material) {
        if (Array.isArray(node.material)) {
          node.material.forEach((material) => {
            if (material && "opacity" in material) {
              material.opacity = nextOpacity;
            }
          });
        } else if ("opacity" in node.material) {
          node.material.opacity = nextOpacity;
        }
      }

      if (typeof node.fillOpacity === "number") {
        node.fillOpacity = nextOpacity;
      }
    });

    if (progress >= 1) {
      onComplete(impact.id);
    }
  });

  return (
    <group ref={groupRef}>
      <MilestoneCard
        milestone={impact.milestone}
        isActive={false}
        isHovered={false}
        layout={impact.layout}
        opacity={1}
        positionOverride={impact.worldPosition}
        interactive={false}
        onHover={() => () => {}}
        onSelect={() => {}}
      />
    </group>
  );
}

function ImpactShatterBurst({ impact, onComplete }) {
  const fragmentsRef = useRef(null);
  const dustRef = useRef(null);
  const elapsedRef = useRef(0);
  const pieceBlueprints = useMemo(
    () =>
      createFragmentBlueprints(
        impact.milestone,
        impact.layout,
        createSeededRandom(hashString(`${impact.id}-shatter`)),
      ),
    [impact.id, impact.layout, impact.milestone],
  );
  const dustBlueprints = useMemo(() => createDustBlueprints(), []);
  const piecesStateRef = useRef(
    pieceBlueprints.map((piece) => ({
      position: piece.initialPosition.clone(),
      velocity: piece.velocity.clone(),
      rotation: piece.rotation.clone(),
      angularVelocity: piece.angularVelocity.clone(),
      size: piece.size.clone(),
      color: piece.color.clone(),
      bounced: 0,
    })),
  );
  const dustStateRef = useRef(
    dustBlueprints.map((particle) => ({
      position: particle.initialPosition.clone(),
      velocity: particle.velocity.clone(),
    })),
  );
  const fragmentDummy = useMemo(() => new THREE.Object3D(), []);
  const fragmentScale = impact.layout.scale;
  const groundY = -impact.layout.height * 0.78;

  useEffect(() => {
    if (!fragmentsRef.current) {
      return undefined;
    }

    pieceBlueprints.forEach((piece, index) => {
      fragmentsRef.current.setColorAt(index, piece.color);
    });

    fragmentsRef.current.instanceColor.needsUpdate = true;

    return undefined;
  }, [pieceBlueprints]);

  useFrame((_, delta) => {
    if (!fragmentsRef.current || !dustRef.current) {
      return;
    }

    elapsedRef.current += delta;
    const elapsed = elapsedRef.current;
    const progress = clamp01(elapsed / explosionLifetime);
    const fade = 1 - easeOutCubic(progress);

    piecesStateRef.current.forEach((piece, index) => {
      piece.velocity.y -= 13.6 * delta;
      piece.position.addScaledVector(piece.velocity, delta);

      if (piece.position.y < groundY && piece.bounced < 1) {
        piece.position.y = groundY;
        piece.velocity.y = Math.abs(piece.velocity.y) * 0.28;
        piece.velocity.x *= 0.72;
        piece.velocity.z *= 0.72;
        piece.angularVelocity.multiplyScalar(0.72);
        piece.bounced += 1;
      } else if (piece.position.y < groundY) {
        piece.position.y = groundY;
        piece.velocity.multiplyScalar(0.84);
      }

      piece.velocity.multiplyScalar(0.988);
      piece.rotation.x += piece.angularVelocity.x * delta;
      piece.rotation.y += piece.angularVelocity.y * delta;
      piece.rotation.z += piece.angularVelocity.z * delta;

      const smear = 1 + Math.min(piece.velocity.length() * 0.032, 0.32) * fade;

      fragmentDummy.position.copy(piece.position);
      fragmentDummy.rotation.set(
        piece.rotation.x,
        piece.rotation.y,
        piece.rotation.z,
      );
      fragmentDummy.scale.set(piece.size.x, piece.size.y, piece.size.z * smear);
      fragmentDummy.updateMatrix();
      fragmentsRef.current.setMatrixAt(index, fragmentDummy.matrix);
    });

    dustStateRef.current.forEach((particle, index) => {
      particle.velocity.y -= 4.4 * delta;
      particle.position.addScaledVector(particle.velocity, delta);
      dustRef.current.geometry.attributes.position.setXYZ(
        index,
        particle.position.x,
        particle.position.y,
        particle.position.z,
      );
    });

    fragmentsRef.current.instanceMatrix.needsUpdate = true;
    fragmentsRef.current.material.opacity = 0.98 * fade;
    dustRef.current.geometry.attributes.position.needsUpdate = true;
    dustRef.current.material.opacity =
      0.34 * (1 - clamp01(elapsed / dustLifetime));

    if (progress >= 1) {
      onComplete(impact.id);
    }
  });

  return (
    <group position={impact.worldPosition} scale={fragmentScale}>
      <instancedMesh
        ref={fragmentsRef}
        args={[null, null, pieceBlueprints.length]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          vertexColors
          transparent
          opacity={1}
          roughness={0.36}
          metalness={0.14}
        />
      </instancedMesh>
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(dustBlueprints.length * 3)}
            count={dustBlueprints.length}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ead9bb"
          size={0.12}
          transparent
          opacity={0.28}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function ImpactRebuildBurst({ impact, onComplete, positionOverride }) {
  const fragmentsRef = useRef(null);
  const dustRef = useRef(null);
  const flashRef = useRef(null);
  const elapsedRef = useRef(0);
  const pieceBlueprints = useMemo(
    () => createRebuildFragmentBlueprints(impact.milestone, impact.layout),
    [impact.layout, impact.milestone],
  );
  const dustBlueprints = useMemo(() => createDustBlueprints(), []);
  const fragmentDummy = useMemo(() => new THREE.Object3D(), []);
  const fragmentScale = impact.layout.scale;

  useEffect(() => {
    if (!fragmentsRef.current) {
      return undefined;
    }

    pieceBlueprints.forEach((piece, index) => {
      fragmentsRef.current.setColorAt(index, piece.color);
    });

    fragmentsRef.current.instanceColor.needsUpdate = true;

    return undefined;
  }, [pieceBlueprints]);

  useFrame((_, delta) => {
    if (!fragmentsRef.current || !dustRef.current) {
      return;
    }

    elapsedRef.current += delta;
    const progress = clamp01(elapsedRef.current / rebuildLifetime);
    const eased = easeOutCubic(progress);
    const inverse = 1 - eased;
    const flashProgress = clamp01((progress - 0.72) / 0.28);
    const flashOpacity = Math.sin(flashProgress * Math.PI) * 0.42;

    pieceBlueprints.forEach((piece, index) => {
      const position = piece.scatterPosition
        .clone()
        .lerp(piece.initialPosition, eased);
      const rotation = new THREE.Euler(
        THREE.MathUtils.lerp(piece.scatterRotation.x, piece.rotation.x, eased),
        THREE.MathUtils.lerp(piece.scatterRotation.y, piece.rotation.y, eased),
        THREE.MathUtils.lerp(piece.scatterRotation.z, piece.rotation.z, eased),
      );
      const smear = 1 + inverse * 0.34;

      fragmentDummy.position.copy(position);
      fragmentDummy.rotation.set(rotation.x, rotation.y, rotation.z);
      fragmentDummy.scale.set(piece.size.x, piece.size.y, piece.size.z * smear);
      fragmentDummy.updateMatrix();
      fragmentsRef.current.setMatrixAt(index, fragmentDummy.matrix);
    });

    dustBlueprints.forEach((particle, index) => {
      const position = particle.initialPosition.clone().multiplyScalar(inverse);
      dustRef.current.geometry.attributes.position.setXYZ(
        index,
        position.x,
        position.y,
        position.z,
      );
    });

    fragmentsRef.current.instanceMatrix.needsUpdate = true;
    fragmentsRef.current.material.opacity = 0.3 + eased * 0.7;
    dustRef.current.geometry.attributes.position.needsUpdate = true;
    dustRef.current.material.opacity = 0.22 * inverse;

    if (flashRef.current) {
      flashRef.current.material.opacity = flashOpacity;
      flashRef.current.scale.setScalar(1 + inverse * 0.06);
    }

    if (progress >= 1) {
      onComplete(impact.id);
    }
  });

  return (
    <group
      position={positionOverride || impact.worldPosition}
      scale={fragmentScale}
    >
      <instancedMesh
        ref={fragmentsRef}
        args={[null, null, pieceBlueprints.length]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          vertexColors
          transparent
          opacity={1}
          roughness={0.36}
          metalness={0.14}
        />
      </instancedMesh>
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(dustBlueprints.length * 3)}
            count={dustBlueprints.length}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ead9bb"
          size={0.12}
          transparent
          opacity={0.22}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <mesh ref={flashRef} position={[0, 0.02, 0.18]}>
        <planeGeometry
          args={[impact.layout.width + 0.24, impact.layout.height + 0.24]}
        />
        <meshBasicMaterial
          color={impact.milestone.accent}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function PlaceholderVehicle() {
  const { scene } = useGLTF(carModelPath, false, true, extendGltfLoader);

  const carScene = useMemo(() => {
    const clonedScene = scene.clone(true);

    clonedScene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = false;
        node.receiveShadow = true;

        if (node.material && "envMapIntensity" in node.material) {
          node.material.envMapIntensity = 1.35;
        }

        if (node.material && "roughness" in node.material) {
          node.material.roughness = Math.max(
            node.material.roughness * 0.82,
            0.22,
          );
        }
      }
    });

    clonedScene.rotation.set(...carRotation);
    clonedScene.scale.setScalar(carScale);

    return clonedScene;
  }, [scene]);

  return (
    <group position={[0, 0.82, 4.6]}>
      <primitive object={carScene} position={[1, 0.1, -5]} />
    </group>
  );
}

function useCityEnvironment() {
  const { scene } = useGLTF(cityModelPath, false, true, extendGltfLoader);

  const { cityScenes, segmentLength } = useMemo(() => {
    const createCityScene = () => {
      const clonedScene = scene.clone(true);

      clonedScene.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });

      clonedScene.rotation.set(...cityRotation);
      clonedScene.scale.setScalar(cityScale);

      return clonedScene;
    };

    const primaryScene = createCityScene();
    const secondaryScene = createCityScene();
    const bounds = new THREE.Box3().setFromObject(primaryScene);
    const size = bounds.getSize(new THREE.Vector3());
    const derivedSegmentLength = Math.max(size.x, size.z, 120);

    return {
      cityScenes: [primaryScene, secondaryScene],
      segmentLength: derivedSegmentLength,
    };
  }, [scene]);

  return { cityScenes, segmentLength };
}

function RepeatingCityEnvironment({ travelOffset }) {
  const { cityScenes, segmentLength } = useCityEnvironment();
  const wrappedOffset = THREE.MathUtils.euclideanModulo(
    travelOffset,
    segmentLength,
  );

  return (
    <>
      <primitive
        object={cityScenes[0]}
        position={[
          cityBasePosition[0],
          cityBasePosition[1],
          cityBasePosition[2] + wrappedOffset,
        ]}
      />
      <primitive
        object={cityScenes[1]}
        position={[
          cityBasePosition[0],
          cityBasePosition[1],
          cityBasePosition[2] - segmentLength + wrappedOffset,
        ]}
      />
    </>
  );
}

function AtmosphereDome() {
  const uniforms = useMemo(
    () => ({
      topColor: { value: new THREE.Color("#5f8fc9") },
      horizonColor: { value: new THREE.Color("#c9dcf2") },
      bottomColor: { value: new THREE.Color("#8ea4ba") },
    }),
    [],
  );

  return (
    <mesh scale={420}>
      <sphereGeometry args={[1, 48, 48]} />
      <shaderMaterial
        args={[
          {
            uniforms,
            vertexShader: atmosphereVertexShader,
            fragmentShader: atmosphereFragmentShader,
            side: THREE.BackSide,
            depthWrite: false,
          },
        ]}
      />
    </mesh>
  );
}

function RoadScene({
  progress,
  sceneData,
  reducedMotion = false,
  onImpact,
  signalStateById = {},
}) {
  const navigate = useNavigate();
  const worldRef = useRef(null);
  const { size } = useThree();
  const { allMilestones, roadTravelDistance } = sceneData;
  const lastMilestoneId = allMilestones.at(-1)?.id ?? null;
  const travelOffset = progress * roadTravelDistance;
  const [hoveredMilestone, setHoveredMilestone] = useState(null);
  const [impactStates, setImpactStates] = useState([]);
  const [removedMilestoneIds, setRemovedMilestoneIds] = useState([]);
  const impactIdsRef = useRef(new Set());
  const impactTimeoutsRef = useRef([]);
  const previousTravelOffsetRef = useRef(travelOffset);
  const isMobileViewport = size.width < 640;
  const cardLayout = isMobileViewport ? mobileCardLayout : desktopCardLayout;

  useEffect(() => {
    setImpactStates([]);
    setRemovedMilestoneIds([]);
    impactIdsRef.current = new Set();

    impactTimeoutsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });

    impactTimeoutsRef.current = [];

    return () => {
      impactTimeoutsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      impactTimeoutsRef.current = [];
    };
  }, [sceneData]);

  const completeImpact = (impactId) => {
    impactIdsRef.current.delete(impactId);
    setImpactStates((current) =>
      current.filter((impact) => impact.id !== impactId),
    );
    setRemovedMilestoneIds((current) =>
      current.includes(impactId) ? current : [...current, impactId],
    );
  };

  const completeRebuild = (impactId) => {
    setImpactStates((current) =>
      current.map((impact) =>
        impact.id === impactId
          ? {
              ...impact,
              stage: "restored",
            }
          : impact,
      ),
    );
  };

  useFrame(() => {
    if (worldRef.current) {
      worldRef.current.position.z = THREE.MathUtils.lerp(
        worldRef.current.position.z,
        travelOffset,
        0.08,
      );

      const isReversing = travelOffset < previousTravelOffsetRef.current;
      const isAdvancing = travelOffset > previousTravelOffsetRef.current;
      previousTravelOffsetRef.current = travelOffset;

      if (isAdvancing) {
        const restoredCollision = impactStates.find((impact) => {
          if (impact.stage !== "restored") {
            return false;
          }

          return (
            impact.localPosition[2] +
              worldRef.current.position.z +
              cardDepth * 0.5 >=
            collisionFrontZ
          );
        });

        if (restoredCollision) {
          setImpactStates((current) =>
            current.map((impact) =>
              impact.id === restoredCollision.id
                ? {
                    ...impact,
                    worldPosition: [
                      impact.localPosition[0],
                      impact.localPosition[1],
                      impact.localPosition[2] + worldRef.current.position.z,
                    ],
                    stage: "hitstop",
                  }
                : impact,
            ),
          );

          if (!reducedMotion && onImpact) {
            onImpact();
          }

          const timeoutId = window.setTimeout(() => {
            setImpactStates((current) =>
              current.map((impact) =>
                impact.id === restoredCollision.id
                  ? {
                      ...impact,
                      stage: reducedMotion ? "fading" : "exploding",
                    }
                  : impact,
              ),
            );
          }, hitStopDurationMs);

          impactTimeoutsRef.current.push(timeoutId);
          previousTravelOffsetRef.current = travelOffset;
          return;
        }
      }

      const nextCollision = allMilestones.find((milestone) => {
        if (
          impactIdsRef.current.has(milestone.id) ||
          removedMilestoneIds.includes(milestone.id)
        ) {
          return false;
        }

        const cardWorldZ = milestone.position[2] + worldRef.current.position.z;
        return cardWorldZ + cardDepth * 0.5 >= collisionFrontZ;
      });

      if (nextCollision) {
        impactIdsRef.current.add(nextCollision.id);

        const resolvedPosition = resolveMilestonePosition(
          nextCollision,
          cardLayout,
        );
        const impact = {
          id: nextCollision.id,
          milestone: nextCollision,
          layout: { ...cardLayout },
          worldPosition: [
            resolvedPosition[0],
            resolvedPosition[1],
            nextCollision.position[2] + worldRef.current.position.z,
          ],
          localPosition: [
            resolvedPosition[0],
            resolvedPosition[1],
            nextCollision.position[2],
          ],
          stage: "hitstop",
        };

        setImpactStates((current) => [...current, impact]);

        if (!reducedMotion && onImpact) {
          onImpact();
        }

        const timeoutId = window.setTimeout(() => {
          setImpactStates((current) =>
            current.map((state) =>
              state.id === nextCollision.id
                ? {
                    ...state,
                    stage: reducedMotion ? "fading" : "exploding",
                  }
                : state,
            ),
          );
        }, hitStopDurationMs);

        impactTimeoutsRef.current.push(timeoutId);
      }

      if (isReversing) {
        const nextRebuild = allMilestones.find((milestone) => {
          if (
            !removedMilestoneIds.includes(milestone.id) ||
            impactIdsRef.current.has(milestone.id)
          ) {
            return false;
          }

          const cardWorldZ =
            milestone.position[2] + worldRef.current.position.z;
          return (
            cardWorldZ + cardDepth * 0.5 <=
            collisionFrontZ - collisionReleaseMargin
          );
        });

        if (nextRebuild) {
          impactIdsRef.current.add(nextRebuild.id);

          const resolvedPosition = resolveMilestonePosition(
            nextRebuild,
            cardLayout,
          );
          setImpactStates((current) => [
            ...current,
            {
              id: nextRebuild.id,
              milestone: nextRebuild,
              layout: { ...cardLayout },
              worldPosition: [
                resolvedPosition[0],
                resolvedPosition[1],
                nextRebuild.position[2] + worldRef.current.position.z,
              ],
              localPosition: [
                resolvedPosition[0],
                resolvedPosition[1],
                nextRebuild.position[2],
              ],
              stage: reducedMotion ? "refading" : "rebuilding",
            },
          ]);
        }
      }
    }
  }, -1);

  const hiddenMilestoneIds = new Set([
    ...removedMilestoneIds,
    ...impactStates.map((impact) => impact.id),
  ]);

  return (
    <>
      <color attach="background" args={["#7ea8d1"]} />
      <fog attach="fog" args={["#7f9db8", 46, 190]} />
      {!isMobileViewport ? <AtmosphereDome /> : null}
      {!isMobileViewport ? (
        <Sky
          distance={450000}
          sunPosition={[14, 11, -10]}
          inclination={0.49}
          azimuth={0.22}
          mieCoefficient={0.0018}
          mieDirectionalG={0.8}
          rayleigh={2.6}
          turbidity={2.6}
        />
      ) : null}
      {!isMobileViewport ? (
        <Environment
          files={environmentFiles}
          background={false}
          environmentIntensity={environmentIntensity}
        />
      ) : null}
      <PerspectiveCamera
        makeDefault
        position={cardLayout.cameraPosition}
        fov={cardLayout.cameraFov}
      />
      <ambientLight intensity={isMobileViewport ? 1.45 : 1.25} color="#edf4ff" />
      <hemisphereLight
        intensity={isMobileViewport ? 0.55 : 0.9}
        groundColor="#22262b"
        color="#d6e7fb"
      />
      <directionalLight
        intensity={isMobileViewport ? 1.35 : 2.15}
        color="#f6f9ff"
        position={[12, 16, 8]}
        shadow-mapSize-width={isMobileViewport ? 512 : 1024}
        shadow-mapSize-height={isMobileViewport ? 512 : 1024}
      />
      {!isMobileViewport ? (
        <directionalLight
          intensity={0.85}
          color="#bdd7ff"
          position={[-10, 8, 14]}
        />
      ) : null}
      <pointLight
        intensity={isMobileViewport ? 0.45 : 0.75}
        color="#d9e8ff"
        position={[0, 4, 6]}
        distance={24}
      />

      {!isMobileViewport ? (
        <RepeatingCityEnvironment travelOffset={travelOffset} />
      ) : null}

      <group ref={worldRef}>
        {allMilestones
          .filter((milestone) => milestone.id !== lastMilestoneId)
          .map((milestone) => (
            <RoadSignal
              key={milestone.id + "-signal"}
              milestone={milestone}
              layout={cardLayout}
              signalState={signalStateById[milestone.id] || "red"}
            />
          ))}

        {allMilestones
          .filter((milestone) => !hiddenMilestoneIds.has(milestone.id))
          .map((milestone) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              isActive={hoveredMilestone === milestone.id}
              isHovered={hoveredMilestone === milestone.id}
              layout={cardLayout}
              onHover={(hovered) => () => {
                setHoveredMilestone(hovered ? milestone.id : null);
              }}
              onSelect={() => {
                navigate("/journey/" + milestone.slug);
              }}
            />
          ))}

        {impactStates
          .filter((impact) => impact.stage === "refading")
          .map((impact) => (
            <MilestoneCard
              key={impact.id}
              milestone={impact.milestone}
              isActive={false}
              isHovered={false}
              layout={impact.layout}
              positionOverride={impact.localPosition}
              interactive={false}
              onHover={() => () => {}}
              onSelect={() => {}}
            />
          ))}

        {impactStates
          .filter((impact) => impact.stage === "rebuilding")
          .map((impact) => (
            <ImpactRebuildBurst
              key={impact.id}
              impact={impact}
              positionOverride={impact.localPosition}
              onComplete={completeRebuild}
            />
          ))}

        {impactStates
          .filter((impact) => impact.stage === "restored")
          .map((impact) => (
            <MilestoneCard
              key={impact.id}
              milestone={impact.milestone}
              isActive={false}
              isHovered={false}
              layout={impact.layout}
              positionOverride={impact.localPosition}
              interactive={false}
              onHover={() => () => {}}
              onSelect={() => {}}
            />
          ))}
      </group>

      {impactStates.map((impact) => {
        if (impact.stage === "hitstop") {
          return (
            <MilestoneCard
              key={impact.id}
              milestone={impact.milestone}
              isActive={false}
              isHovered={false}
              layout={impact.layout}
              positionOverride={impact.worldPosition}
              interactive={false}
              onHover={() => () => {}}
              onSelect={() => {}}
            />
          );
        }

        if (impact.stage === "fading") {
          return (
            <ImpactFadeCard
              key={impact.id}
              impact={impact}
              onComplete={completeImpact}
            />
          );
        }

        if (impact.stage === "refading") {
          return null;
        }

        if (impact.stage === "rebuilding") {
          return null;
        }

        if (impact.stage === "restored") {
          return null;
        }

        return (
          <ImpactShatterBurst
            key={impact.id}
            impact={impact}
            onComplete={completeImpact}
          />
        );
      })}

      <PlaceholderVehicle />
    </>
  );
}

function SceneLoader() {
  return (
    <Html center>
      <div
        style={{
          minWidth: "220px",
          padding: "16px 18px",
          borderRadius: "18px",
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(10, 17, 24, 0.82)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.28)",
          color: "#f5f9ff",
          textAlign: "center",
          fontFamily: '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif',
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            margin: "0 auto 12px",
            borderRadius: "999px",
            border: "3px solid rgba(255,255,255,0.18)",
            borderTopColor: "#7fd1ff",
            animation: "drive-loader-spin 0.9s linear infinite",
          }}
        />
        <div
          style={{
            fontSize: "0.78rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Loading scene
        </div>
        <div style={{ marginTop: "6px", fontSize: "0.9rem", opacity: 0.78 }}>
          Preparing models and road signs...
        </div>
      </div>
    </Html>
  );
}

function DriveExperience({
  progress,
  sceneData,
  reducedMotion = false,
  onImpact,
  activeStopId,
  signalStateById,
}) {
  if (process.env.NODE_ENV === "test") {
    return <div className="drive-stage-fallback" aria-label="3d drive stage" />;
  }

  const resolvedSceneData = sceneData || buildJourneyScene([], 1);
  const isMobileViewport =
    typeof window !== "undefined" ? window.innerWidth < 640 : false;
  const canvasDpr = isMobileViewport ? [1, 1.05] : [1, 1.25];

  return (
    <>
      <style>
        {"@keyframes drive-loader-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }"}
      </style>
      <Canvas
        dpr={canvasDpr}
        shadows={!isMobileViewport}
        gl={{
          antialias: !isMobileViewport,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={<SceneLoader />}>
          <RoadScene
            progress={progress}
            sceneData={resolvedSceneData}
            reducedMotion={reducedMotion}
            onImpact={onImpact}
            activeStopId={activeStopId}
            signalStateById={signalStateById}
          />
        </Suspense>
      </Canvas>
    </>
  );
}

useGLTF.preload(cityModelPath, false, true, extendGltfLoader);
useGLTF.preload(carModelPath, false, true, extendGltfLoader);

export default DriveExperience;
