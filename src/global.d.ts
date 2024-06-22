import { CadastralParcelLookupResponse } from './library/dxfModel';

// custom-event-types.d.ts
interface CustomEventMap {
  'identify:cadaster': CustomEvent<CadastralParcelLookupResponse>;
}

declare global {
  interface DocumentEventMap extends CustomEventMap {}
}

// This ensures the module augmentation takes effect
export {};
