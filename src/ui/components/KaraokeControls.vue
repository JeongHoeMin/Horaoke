<script setup lang="ts">
import {ref} from "vue";
import {useKaraoke} from "../hooks/useKaraoke.ts";
import {getErrorMessage} from "../../app/modules/ErrorModule.ts";

const api = useKaraoke();
const audioRef = ref<HTMLAudioElement | null>(null);

const busy = ref<boolean>(false);
const micOn = ref<boolean>(false);
const musicOn = ref<boolean>(false);
const hasMusic = ref<boolean>(false);
const error = ref<string|null>(null);

const micGain = ref<number>(1.0);
const delayMs = ref<number>(120);
const feedback = ref<number>(0.25);
const reverbMix = ref<number>(0.3);
const musicGain = ref<number>(1.0);
const semitone = ref<number>(0);
const master = ref<number>(1.0);

// 마이크
async function onMic() {
  try {
    busy.value = true;
    error.value = null;
    if (micOn.value) {
      api.stopMic();
      micOn.value = false;
    } else {
      await api.startMic();
      micOn.value = true;
    }
  } catch (e: unknown) {
    error.value = getErrorMessage(e);
  } finally {
    busy.value = false;
  }
}

// 파일 선택 시
async function onPick(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (!f || !audioRef.value) return;

  await api.attachMusicFromFile(audioRef.value, f);
  hasMusic.value = true;
}

async function onMusic() {
  if (!api) return;
  if (musicOn.value) {
    await api.pauseMusic();
    musicOn.value = false;
  } else {
    await api.playMusic();
    musicOn.value = true;
  }
}

function applyDelay() {
  api?.setDelay(delayMs.value, feedback.value);
}

function applyReverb() {
  api?.setReverbMix(reverbMix.value);
}

function applyMusicGain() {
  api?.setMusicGain(musicGain.value);
}

function applyMicGain() {
  api?.setMicGain(micGain.value);
}

function applyPitch() {
  api?.setPitchSemitone(semitone.value);
}

function applyMaster() {
  api?.setMasterGain(master.value);
}
</script>

<template>
  <div class="p-4 space-y-3">
    <h2 class="text-xl font-bold">노래방</h2>

    <div class="space-x-2">
      <button @click="onMic" :disabled="busy">{{ micOn ? '마이크 끄기' : '마이크 켜기' }}</button>
    </div>

    <div>
      <label>노래 파일: </label>
      <input type="file" accept="audio/*" @change="onPick" />
    </div>

    <div class="space-x-2" v-if="hasMusic">
      <button @click="onMusic" :disabled="busy">{{ musicOn ? '음악 정지' : '음악 재생' }}</button>
    </div>

    <div class="space-y-1">
      <div>마이크 볼륨: {{ micGain.toFixed(2) }}</div>
      <input type="range" min="0" max="2" step="0.01" v-model.number="micGain" @input="applyMicGain" />
    </div>

    <div class="space-y-1">
      <div>에코(ms): {{ delayMs }} / 피드백: {{ feedback }}</div>
      <input type="range" min="0" max="500" step="1" v-model.number="delayMs" @input="applyDelay" />
      <input type="range" min="0" max="0.95" step="0.01" v-model.number="feedback" @input="applyDelay" />
    </div>

    <div class="space-y-1">
      <div>리버스 믹스: {{ reverbMix.toFixed(2) }}</div>
      <input type="range" min="0" max="1" step="0.01" v-model.number="reverbMix" @input="applyReverb" />
    </div>

    <div class="space-y-1" v-if="hasMusic">
      <div>음악 볼륨: {{ musicGain.toFixed(2) }}</div>
      <input type="range" min="0" max="2" step="0.01" v-model.number="musicGain" @input="applyMusicGain" />
    </div>

    <div class="space-y-1" v-if="hasMusic">
      <div>키 조절(반음): {{ semitone }}</div>
      <input type="range" min="-6" max="6" step="1" v-model.number="semitone" @input="applyPitch" />
    </div>

    <div class="space-y-1">
      <div>마스터 볼륨: {{ master.toFixed(2) }}</div>
      <input type="range" min="0" max="1.5" step="0.01" v-model.number="master" @input="applyMaster" />
    </div>

    <p v-if="error" style="color:#f66">에러: {{ error }}</p>
    <audio ref="audioRef" style="display:none"></audio>
  </div>
</template>

<style scoped>

</style>