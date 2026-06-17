/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VerbExercise {
  id: string;
  tense: 'futuro_simple' | 'futuro_perfecto';
  subject: string; // Yo, Tú, Él/Ella, Nosotros, Vosotros, Ellos/Ellas
  infinitive: string; // cantar, comer, hacer, etc.
  englishInfinitive: string;
  russianInfinitive: string; // Armenian infinitive translation
  translationRu: string; // Armenian conjugated translation
  answer: string; // Spanish conjugated
  hintRu: string; // Armenian grammar note
  isIrregular: boolean;
}

export const VERB_EXERCISES: VerbExercise[] = [
  // === FUTURO SIMPLE (REGULAR) ===
  {
    id: 'fs_1',
    tense: 'futuro_simple',
    subject: 'Yo',
    infinitive: 'hablar',
    englishInfinitive: 'to speak',
    russianInfinitive: 'խոսել',
    translationRu: 'Ես կխոսեմ',
    answer: 'hablaré',
    hintRu: 'Futuro Simple-ում -ar-ով վերջացող կանոնավոր բայերի դեպքում Yo դեմքի համար անորոշ ձևին ավելացվում է -é վերջավորությունը:',
    isIrregular: false
  },
  {
    id: 'fs_2',
    tense: 'futuro_simple',
    subject: 'Tú',
    infinitive: 'cantar',
    englishInfinitive: 'to sing',
    russianInfinitive: 'երգել',
    translationRu: 'Դու կերգես',
    answer: 'cantarás',
    hintRu: 'Cantar անորոշ ձևին ավելացվում է -ás վերջավորությունը (Tú): Չմոռանա՛ս "á" շեշտի մասին:',
    isIrregular: false
  },
  {
    id: 'fs_3',
    tense: 'futuro_simple',
    subject: 'Él',
    infinitive: 'comer',
    englishInfinitive: 'to eat',
    russianInfinitive: 'ուտել',
    translationRu: 'Նա կուտի',
    answer: 'comerá',
    hintRu: '-er-ով վերջացող բայերի վերջավորությունները նույնն են, ինչ -ar բայերինը: Comer անորոշ ձևին ավելացվում է -á վերջավորությունը (él):',
    isIrregular: false
  },
  {
    id: 'fs_4',
    tense: 'futuro_simple',
    subject: 'Nosotros',
    infinitive: 'estudiar',
    englishInfinitive: 'to study',
    russianInfinitive: 'սովորել',
    translationRu: 'Մենք կսովորենք',
    answer: 'estudiaremos',
    hintRu: 'Estudiar բային ավելացվում է -emos վերջավորությունը (Nosotros): Վերջավորության "e" տառը գրվում է առանց շեշտի:',
    isIrregular: false
  },
  {
    id: 'fs_5',
    tense: 'futuro_simple',
    subject: 'Vosotros',
    infinitive: 'vivir',
    englishInfinitive: 'to live',
    russianInfinitive: 'ապրել',
    translationRu: 'Դուք կապրեք (իսպ. Vosotros)',
    answer: 'viviréis',
    hintRu: 'Vivir բային ավելացվում է -éis վերջավորությունը (Vosotros): Պարտադիր է "é" տառի վրա գրել շեշտը:',
    isIrregular: false
  },
  {
    id: 'fs_6',
    tense: 'futuro_simple',
    subject: 'Ellas',
    infinitive: 'escribir',
    englishInfinitive: 'to write',
    russianInfinitive: 'գրել',
    translationRu: 'Նրանք կգրեն (իգ. սեռ)',
    answer: 'escribirán',
    hintRu: 'Escribir բային ավելացվում է -án վերջավորությունը (Ellas): Անպայման շեշտով` "á":',
    isIrregular: false
  },

  // === FUTURO SIMPLE (IRREGULAR) ===
  {
    id: 'fs_ir_1',
    tense: 'futuro_simple',
    subject: 'Yo',
    infinitive: 'tener',
    englishInfinitive: 'to have',
    russianInfinitive: 'ունենալ',
    translationRu: 'Ես կունենամ',
    answer: 'tendré',
    hintRu: 'Tener բայն ունի անկանոն հիմք tendr- ապառնի ժամանակում: Դրան ավելացվում են սովորական վերջավորությունները:',
    isIrregular: true
  },
  {
    id: 'fs_ir_2',
    tense: 'futuro_simple',
    subject: 'Tú',
    infinitive: 'hacer',
    englishInfinitive: 'to do / to make',
    russianInfinitive: 'անել',
    translationRu: 'Դու կանես',
    answer: 'harás',
    hintRu: 'Hacer բայն ունի հատուկ հիմք har-: Ավելացրո՛ւ -ás վերջավորությունը Tú-ի համար:',
    isIrregular: true
  },
  {
    id: 'fs_ir_3',
    tense: 'futuro_simple',
    subject: 'Ella',
    infinitive: 'decir',
    englishInfinitive: 'to say / to tell',
    russianInfinitive: 'ասել',
    translationRu: 'Նա կասի',
    answer: 'dirá',
    hintRu: 'Decir բայը փոխում է հիմքը dir--ի: Ավելացրո՛ւ ապառնի ժամանակի -á վերջավորությունը Ella-ի համար:',
    isIrregular: true
  },
  {
    id: 'fs_ir_4',
    tense: 'futuro_simple',
    subject: 'Nosotros',
    infinitive: 'poder',
    englishInfinitive: 'to be able to',
    russianInfinitive: 'կարողանալ',
    translationRu: 'Մենք կկարողանանք',
    answer: 'podremos',
    hintRu: 'Poder բայում դուրս է ընկնում "e" ձայնավորը, հիմքն է` podr-: Nosotros-ի համար վերջավորությունն է` -emos:',
    isIrregular: true
  },
  {
    id: 'fs_ir_5',
    tense: 'futuro_simple',
    subject: 'Ellos',
    infinitive: 'salir',
    englishInfinitive: 'to go out / leave',
    russianInfinitive: 'դուրս գալ / մեկնել',
    translationRu: 'Նրանք դուրս կգան',
    answer: 'saldrán',
    hintRu: 'Salir բայի հիմքը ապառնիում` saldr-: Ավելացրո՛ւ -án վերջավորությունը Ellos-ի համար:',
    isIrregular: true
  },
  {
    id: 'fs_ir_6',
    tense: 'futuro_simple',
    subject: 'Yo',
    infinitive: 'querer',
    englishInfinitive: 'to want / love',
    russianInfinitive: 'ուզենալ / սիրել',
    translationRu: 'Ես կուզենամ',
    answer: 'querré',
    hintRu: 'Querer բայում կրկնապատկվում է "r" տառը հիմքում` querr-: Yo-ի համար ձևն է` querré:',
    isIrregular: true
  },
  {
    id: 'fs_ir_7',
    tense: 'futuro_simple',
    subject: 'Vosotros',
    infinitive: 'saber',
    englishInfinitive: 'to know',
    russianInfinitive: 'իմանալ',
    translationRu: 'Դուք կիմանաք',
    answer: 'sabréis',
    hintRu: 'Saber բայի հիմքը ապառնիում` sabr-: Ավելացրո՛ւ -éis վերջավորությունը Vosotros-ի համար:',
    isIrregular: true
  },
  {
    id: 'fs_ir_8',
    tense: 'futuro_simple',
    subject: 'Nosotros',
    infinitive: 'poner',
    englishInfinitive: 'to put',
    russianInfinitive: 'դնել',
    translationRu: 'Մենք կդնենք',
    answer: 'pondremos',
    hintRu: 'Poner բայի հիմքը ապառնիում` pondr-: Nosotros-ի համար վերջավորությունն է` -emos:',
    isIrregular: true
  },
  {
    id: 'fs_ir_9',
    tense: 'futuro_simple',
    subject: 'Él',
    infinitive: 'venir',
    englishInfinitive: 'to come',
    russianInfinitive: 'գալ',
    translationRu: 'Նա կգա',
    answer: 'vendrá',
    hintRu: 'Venir բայի հիմքն է` vendr-: Ավելացրո՛ւ -á վերջավորությունը Él-ի համար:',
    isIrregular: true
  },

  // === FUTURO PERFECTO (REGULAR) ===
  {
    id: 'fp_1',
    tense: 'futuro_perfecto',
    subject: 'Yo',
    infinitive: 'comer',
    englishInfinitive: 'to eat',
    russianInfinitive: 'ուտել',
    translationRu: 'Ես արդեն կերած կլինեմ (մինչև ինչ-որ պահ)',
    answer: 'habré comido',
    hintRu: 'Futuro Perfecto-ն կազմվում է` haber-ը Futuro-ում + բայի դերբայը (-ado/-ido): Yo-ի համար` "habré comido":',
    isIrregular: false
  },
  {
    id: 'fp_2',
    tense: 'futuro_perfecto',
    subject: 'Tú',
    infinitive: 'estudiar',
    englishInfinitive: 'to study',
    russianInfinitive: 'սովորել',
    translationRu: 'Դու արդեն սովորած կլինես',
    answer: 'habrás estudiado',
    hintRu: 'Tú-ի համար haber բայի ձևն է` "habrás": Estudiar-ի դերբայը` "estudiado": Գրվում է երկու բառով:',
    isIrregular: false
  },
  {
    id: 'fp_3',
    tense: 'futuro_perfecto',
    subject: 'Ella',
    infinitive: 'cantar',
    englishInfinitive: 'to sing',
    russianInfinitive: 'երգել',
    translationRu: 'Նա արդեն երգած կլինի',
    answer: 'habrá cantado',
    hintRu: 'Ella-ի համար haber-ի ձևն է` "habrá": Cantar-ի դերբայը` "cantado":',
    isIrregular: false
  },
  {
    id: 'fp_4',
    tense: 'futuro_perfecto',
    subject: 'Nosotros',
    infinitive: 'viajar',
    englishInfinitive: 'to travel',
    russianInfinitive: 'ճանապարհորդել',
    translationRu: 'Մենք արդեն ճանապարհորդած կլինենք',
    answer: 'habremos viajado',
    hintRu: 'Nosotros-ի համար haber-ի ձևն է` "habremos": Viajar-ի դերբայը` "viajado":',
    isIrregular: false
  },
  {
    id: 'fp_5',
    tense: 'futuro_perfecto',
    subject: 'Vosotros',
    infinitive: 'aprender',
    englishInfinitive: 'to learn',
    russianInfinitive: 'սովորել / յուրացնել',
    translationRu: 'Դուք արդեն սովորած կլինեք',
    answer: 'habréis aprendido',
    hintRu: 'Vosotros-ի համար haber-ի ձևն է` "habréis": Aprender (-er) բայի դերբայը վերջանում է -ido-ով ("aprendido"):',
    isIrregular: false
  },
  {
    id: 'fp_6',
    tense: 'futuro_perfecto',
    subject: 'Ellos',
    infinitive: 'vivir',
    englishInfinitive: 'to live',
    russianInfinitive: 'ապրել',
    translationRu: 'Նրանք արդեն ապրած կլինեն',
    answer: 'habrán vivido',
    hintRu: 'Ellos-ի համար haber-ի ձևն է` "habrán": Vivir (-ir) բայի դերբայը վերջանում է -ido-ով ("vivido"):',
    isIrregular: false
  },

  // === FUTURO PERFECTO (IRREGULAR PARTICIPLES) ===
  {
    id: 'fp_ir_1',
    tense: 'futuro_perfecto',
    subject: 'Yo',
    infinitive: 'hacer',
    englishInfinitive: 'to do / make',
    russianInfinitive: 'անել',
    translationRu: 'Ես արդեն արած կլինեմ',
    answer: 'habré hecho',
    hintRu: 'Hacer բայն ունի անկանոն դերբայ` HECHO: Yo-ի ձևն է` "habré hecho":',
    isIrregular: true
  },
  {
    id: 'fp_ir_2',
    tense: 'futuro_perfecto',
    subject: 'Tú',
    infinitive: 'escribir',
    englishInfinitive: 'to write',
    russianInfinitive: 'գրել',
    translationRu: 'Դու արդեն գրած կլինես',
    answer: 'habrás escrito',
    hintRu: 'Escribir բայի դերբայը անկանոն է` ESCRITO: Tú-ի ձևն է` "habrás escrito":',
    isIrregular: true
  },
  {
    id: 'fp_ir_3',
    tense: 'futuro_perfecto',
    subject: 'Él',
    infinitive: 'ver',
    englishInfinitive: 'to see',
    russianInfinitive: 'տեսնել',
    translationRu: 'Նա արդեն տեսած կլինի',
    answer: 'habrá visto',
    hintRu: 'Ver բայի դերբայը անկանոն է` VISTO: Él-ի ձևն է` "habrá visto":',
    isIrregular: true
  },
  {
    id: 'fp_ir_4',
    tense: 'futuro_perfecto',
    subject: 'Nosotros',
    infinitive: 'decir',
    englishInfinitive: 'to say',
    russianInfinitive: 'ասել',
    translationRu: 'Մենք արդեն ասած կլինենք',
    answer: 'habremos dicho',
    hintRu: 'Decir բայի դերբայը անկանոն է` DICHO: Nosotros-ի ձևն է` "habremos dicho":',
    isIrregular: true
  },
  {
    id: 'fp_ir_5',
    tense: 'futuro_perfecto',
    subject: 'Ellas',
    infinitive: 'abrir',
    englishInfinitive: 'to open',
    russianInfinitive: 'բացել',
    translationRu: 'Նրանք արդեն բացած կլինեն',
    answer: 'habrán abierto',
    hintRu: 'Abrir բայի դերբայը անկանոն է` ABIERTO: Ellas-ի ձևն է` "habrán abierto":',
    isIrregular: true
  },
  {
    id: 'fp_ir_6',
    tense: 'futuro_perfecto',
    subject: 'Tú',
    infinitive: 'poner',
    englishInfinitive: 'to put',
    russianInfinitive: 'դնել',
    translationRu: 'Դու արդեն դրած կլինես',
    answer: 'habrás puesto',
    hintRu: 'Poner բայի դերբայը անկանոն է` PUESTO: Tú-ի ձևն է` "habrás puesto":',
    isIrregular: true
  },
  {
    id: 'fp_ir_7',
    tense: 'futuro_perfecto',
    subject: 'Yo',
    infinitive: 'romper',
    englishInfinitive: 'to break',
    russianInfinitive: 'կոտրել',
    translationRu: 'Ես արդեն կոտրած կլինեմ',
    answer: 'habré roto',
    hintRu: 'Romper բայի դերբայը անկանոն է` ROTO: Yo-ի ձևն է` "habré roto":',
    isIrregular: true
  },
  {
    id: 'fp_ir_8',
    tense: 'futuro_perfecto',
    subject: 'Nosotros',
    infinitive: 'volver',
    englishInfinitive: 'to return',
    russianInfinitive: 'վերադառնալ',
    translationRu: 'Մենք արդեն վերադարձած կլինենք',
    answer: 'habremos vuelto',
    hintRu: 'Volver բայի դերբայը անկանոն է` VUELTO: Nosotros-ի ձևն է` "habremos vuelto":',
    isIrregular: true
  }
];

// Simple Spanish piano tunes that Gayane can play!
export interface PianoSong {
  name: string;
  originalName: string;
  notes: string[]; // Notes to play, e.g. ["C4", "C4", "G4", "G4", "A4", "A4", "G4"]
  labels: string[]; // Solfège letters, like ["Do", "Do", "Sol", "Sol", "La", "La", "Sol"]
  lyrics: string; // Spanish translations or small text
}

export const PIANO_SONGS: PianoSong[] = [
  {
    name: "Էստրելիտա (Քո աստղը)",
    originalName: "Estrellita (Twinkle Twinkle)",
    notes: ["C4", "C4", "G4", "G4", "A4", "A4", "G4", "F4", "F4", "E4", "E4", "D4", "D4", "C4"],
    labels: ["Do", "Do", "Sol", "Sol", "La", "La", "Sol", "Fa", "Fa", "Mi", "Mi", "Re", "Re", "Do"],
    lyrics: "¡Estrellita, dónde estás! Me pregunto qué serás..."
  },
  {
    name: "Ծնունդդ շնորհավոր!",
    originalName: "Cumpleaños Feliz",
    notes: ["C4", "C4", "D4", "C4", "F4", "E4", "C4", "C4", "D4", "C4", "G4", "F4"],
    labels: ["Do", "Do", "Re", "Do", "Fa", "Mi", "Do", "Do", "Re", "Do", "Sol", "Fa"],
    lyrics: "Cumpleaños feliz, cumpleaños feliz, te deseamos todos..."
  },
  {
    name: "Օդա ուրախությանը",
    originalName: "Himno a la Alegría",
    notes: ["E4", "E4", "F4", "G4", "G4", "F4", "E4", "D4", "C4", "C4", "D4", "E4", "E4", "D4", "D4"],
    labels: ["Mi", "Mi", "Fa", "Sol", "Sol", "Fa", "Mi", "Re", "Do", "Do", "Re", "Mi", "Mi", "Re", "Re"],
    lyrics: "Escucha hermano la canción de la alegría, el canto alegre del..."
  },
  {
    name: "Կուկարաչա",
    originalName: "La Cucaracha",
    notes: ["C4", "C4", "C4", "F4", "A4", "C4", "C4", "C4", "F4", "A4", "F4", "F4", "E4", "E4", "D4", "D4", "C4"],
    labels: ["Do", "Do", "Do", "Fa", "La", "Do", "Do", "Do", "Fa", "La", "Fa", "Fa", "Mi", "Mi", "Re", "Re", "Do"],
    lyrics: "La cucaracha, la cucaracha, ya no puede caminar..."
  }
];
