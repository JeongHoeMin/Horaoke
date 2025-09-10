export interface IMixer {
  bus(): AudioNode;
  setMasterGain(v: number): void;
  close(): void;
}