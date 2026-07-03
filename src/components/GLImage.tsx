import { useTexture } from '@react-three/drei';
import { forwardRef, useMemo, useRef } from 'react';
import * as THREE from 'three';
import fragmentShader from '../shaders/horizontal-image/fragment.glsl?raw';
import vertexShader from '../shaders/horizontal-image/vertex.glsl?raw';

interface GLImageProps {
  imageUrl: string;
  scale?: [number, number, number];
  // Real-world plane dimensions used for the aspect-fit uniform. Defaults to
  // scale when omitted; pass explicitly when the geometry itself is pre-sized
  // (e.g. a curved arc) and the mesh scale is left at [1, 1, 1].
  planeSize?: [number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  curveStrength?: number;
  curveFrequency?: number;
  geometry: THREE.BufferGeometry;
}

const GLImage = forwardRef<THREE.Mesh, GLImageProps>(
  (
    {
      imageUrl,
      scale = [1, 1, 1],
      planeSize,
      position = [0, 0, 0],
      rotation = [0, 0, 0],
      curveStrength,
      curveFrequency,
      geometry,
    },
    forwardedRef,
  ) => {
    const localRef = useRef<THREE.Mesh>(null);
    const imageRef = forwardedRef || localRef;
    const texture = useTexture(imageUrl);

    const imageSizes = useMemo(() => {
      if (!texture || !texture.image) return [1, 1];
      return [texture.image.width, texture.image.height];
    }, [texture]);

    const shaderArgs = useMemo(
      () => ({
        uniforms: {
          uTexture: { value: texture },
          uScrollSpeed: { value: 0.0 },
          uPlaneSizes: {
            value: new THREE.Vector2(
              planeSize ? planeSize[0] : scale[0],
              planeSize ? planeSize[1] : scale[1],
            ),
          },
          uImageSizes: {
            value: new THREE.Vector2(imageSizes[0], imageSizes[1]),
          },
          uCurveStrength: { value: curveStrength || 0 },
          uCurveFrequency: { value: curveFrequency || 0 },
        },
        side: THREE.DoubleSide,
        vertexShader,
        fragmentShader,
      }),
      [texture, curveStrength, curveFrequency, scale, planeSize, imageSizes],
    );

    return (
      <mesh position={position} rotation={rotation} ref={imageRef} scale={scale}>
        <primitive object={geometry} attach="geometry" />
        <shaderMaterial {...shaderArgs} />
      </mesh>
    );
  },
);

GLImage.displayName = 'GLImage';

export default GLImage;
