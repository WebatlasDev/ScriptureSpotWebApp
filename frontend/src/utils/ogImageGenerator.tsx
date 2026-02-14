/** @jsxImportSource react */
import satori from 'satori';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import path from 'path';
import { readFileSync } from 'fs';
import theme from '@/theme';
import { env } from '@/types/env';

const OG_TIMEOUT_MS = 4000;

const interRegular = readFileSync(path.resolve(process.cwd(), 'public/assets/fonts/Inter-Regular.ttf'));
const interBold = readFileSync(path.resolve(process.cwd(), 'public/assets/fonts/Inter-Bold.ttf'));
const wasmUrl = env.site + '/resvg.wasm';
const localWasmPath = path.resolve(process.cwd(), 'public/resvg.wasm');
const localWasmBuffer = readFileSync(localWasmPath);
const localWasmArrayBuffer = localWasmBuffer.buffer.slice(
  localWasmBuffer.byteOffset,
  localWasmBuffer.byteOffset + localWasmBuffer.byteLength
);

let wasmInitialized = false;
let wasmBinaryPromise: Promise<Uint8Array> | null = null;

function withTimeout<T>(promise: Promise<T>, timeoutMessage: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, OG_TIMEOUT_MS);

    promise
      .then(result => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

async function loadWasmBinary() {
  if (!wasmBinaryPromise) {
    wasmBinaryPromise = (async () => {
      try {
        const response = await withTimeout(fetch(wasmUrl), 'Fetching resvg.wasm timed out');
        if (!response.ok) {
          throw new Error(`Failed to fetch resvg.wasm: ${response.status} ${response.statusText}`);
        }
        const wasmBuffer = await withTimeout(
          response.arrayBuffer(),
          'Reading resvg.wasm response timed out'
        );
        return new Uint8Array(wasmBuffer);
      } catch (error) {
        console.error('Falling back to bundled resvg.wasm', error);
        return new Uint8Array(localWasmArrayBuffer);
      }
    })();
  }
  return wasmBinaryPromise;
}

export async function generateOgImage({
  title,
  subtitle,
  footerLeft = 'scripturespot.com',
  footerRight,
  color = theme.palette.secondary.main,
  imageUrl,
}: {
  title: string;
  subtitle?: string;
  footerLeft?: string;
  footerRight?: string;
  color?: string;
  imageUrl?: string;
}) {
  if (!wasmInitialized) {
    const wasmBinary = await loadWasmBinary();
    await initWasm(wasmBinary);
    wasmInitialized = true;
  }

  const width = 1200;
  const height = 630;

  const svg = await satori(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: theme.palette.background.default,
        padding: '60px',
        fontFamily: 'Inter',
        position: 'relative',
      }}
    >
      <img
        src="https://scripture-spot-frontend.vercel.app/assets/images/logos/Scripture-Spot-Logo.png"
        alt="Scripture Spot Logo"
        style={{ position: 'absolute', top: '40px', left: '60px', color, width: '294', height: '54px' }}
      />
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Image"
          style={{ position: 'absolute', top: '40px', right: '60px', width: '80px', height: '80px', borderRadius: '50%' }}
        />
      )}
      <div style={{ fontSize: '56px', fontWeight: 700, color, marginBottom: '20px', textAlign: 'center' }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: '32px', fontWeight: 400, color: theme.palette.text.primary, textAlign: 'center', maxWidth: '900px' }}>
          {subtitle}
        </div>
      )}
      <div style={{ position: 'absolute', bottom: '40px', right: '60px', fontSize: '24px', fontWeight: 700, color }}>
        {footerLeft}
      </div>
      {footerRight && (
        <div style={{ position: 'absolute', bottom: '40px', left: '60px', fontSize: '24px', fontWeight: 700, color: theme.palette.text.secondary }}>
          {footerRight}
        </div>
      )}
    </div>,
    {
      width,
      height,
      fonts: [
        {
          name: 'Inter',
          data: interRegular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: interBold,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );

  return new Resvg(svg).render().asPng();
}
