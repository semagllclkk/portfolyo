import { LOOKS, personFrames } from './art'

// Karakter kareleri bir kez üretilir; bilinmeyen görünüm varsayılana düşer
const frameCache = {}
export const framesFor = (look) => (frameCache[look] ??= personFrames(LOOKS[look] ? look : 'player'))
