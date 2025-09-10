class PitchShifterProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{ name: 'pitchRatio', defaultValue: 1.0, minValue: 0.5, maxValue: 2.0, automationRate: 'k-rate' }];
  }

  constructor() {
    super();
    this.buffer = new Float32Array(0);
    this.readIndex = 0;
    this.windowSize = 2048;
    this.hopSize = 512;
    this.window = this.hann(this.windowSize);
  }

  hann(n) {
    const w = new Float32Array(n);
    for (let i = 0; i < n; i++) w[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (n - 1)));
    return w;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    const ratio = parameters.pitchRatio.length > 0 ? parameters.pitchRatio[0] : 1.0;

    if (input.length === 0) return true;
    const inL = input[0]; // mono 가정(스테레오면 좌우 반복 처리)
    const outL = output[0];

    // 입력을 순차 누적
    const combined = new Float32Array(this.buffer.length + inL.length);
    combined.set(this.buffer, 0);
    combined.set(inL, this.buffer.length);
    this.buffer = combined;

    // 그레인 처리
    let outIdx = 0;
    while (this.readIndex + this.windowSize < this.buffer.length && outIdx + this.hopSize <= outL.length) {
      // 시간 스케일링: 읽는 속도를 ratio 로 바꿔 피치 변조
      const grain = new Float32Array(this.windowSize);
      for (let i = 0; i < this.windowSize; i++) {
        const idx = Math.floor(this.readIndex + i * ratio);
        if (idx < this.buffer.length) grain[i] = this.buffer[idx] * this.window[i];
      }

      // 출력 버퍼에 중첩 합성(OLA)
      for (let i = 0; i < this.windowSize && outIdx + i < outL.length; i++) {
        outL[outIdx + i] += grain[i];
      }

      // 다음 윈도우로 홉
      this.readIndex += this.hopSize;
      outIdx += this.hopSize;
    }

    // 사용한 만큼 버퍼 소모
    if (this.readIndex > 0) {
      this.buffer = this.buffer.slice(this.readIndex);
      this.readIndex = 0;
    }

    // 스테레오 출력 대응(간단 복제)
    if (output.length > 1) {
      const outR = output[1];
      outR.set(outL);
    }

    return true;
  }
}

registerProcessor('pitch-shifter-processor', PitchShifterProcessor);