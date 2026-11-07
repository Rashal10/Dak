export interface MusicTrack {
  id: string
  title: string
  detail: string
  audioSrc: string | null
  raga: string
  ragaHindi: string
  scene: string
  painting: string
  paintingWidth: number
  paintingHeight: number
  paintingCredit: string
  stampId: string
  collectionNote?: string
}

export const musicTracks: MusicTrack[] = [
  {
    id: 'shankara',
    title: 'Shankara',
    detail: 'Rishab Rikhiram Sharma',
    audioSrc: 'audio/shankara.mp3',
    raga: 'Bhairava Raga',
    ragaHindi: 'भैरव राग',
    scene: 'The raga of Shiva, painted as a lord attended in his palace.',
    painting: 'assets/ragamala/shankara.webp',
    paintingWidth: 520,
    paintingHeight: 633,
    paintingCredit: 'Datia , Madhya Pradesh, c. 1650. Los Angeles County Museum of Art.',
    stampId: 'ravi-shankar-2016',
  },
  {
    id: 'i-wanted-to-leave',
    title: 'I Wanted to Leave',
    detail: 'Sitar version · SYML & Rishab Rikhiram Sharma',
    audioSrc: 'audio/i-wanted-to-leave.mp3',
    raga: 'Todi Ragini',
    ragaHindi: 'तोड़ी रागिनी',
    scene: 'A woman with a veena walks through the forest, and the deer follow her music.',
    painting: 'assets/ragamala/i-wanted-to-leave.webp',
    paintingWidth: 520,
    paintingHeight: 812,
    paintingCredit: 'Ragamala series, 1755. Cleveland Museum of Art.',
    stampId: 'veena-1998',
  },
  {
    id: 'tumhi-dekho-naa',
    title: 'Tumhi Dekho Naa',
    detail: 'Sitar lofi · Rishab Rikhiram Sharma & Shankar-Ehsaan-Loy',
    audioSrc: 'audio/tumhi-dekho-naa.mp3',
    raga: 'Radha and Krishna',
    ragaHindi: 'राधा कृष्ण',
    scene: 'The divine lovers sit together in a palace, surrounded by attendants.',
    painting: 'assets/ragamala/tumhi-dekho-naa.webp',
    paintingWidth: 520,
    paintingHeight: 699,
    paintingCredit: 'Ragamala series, c. 1610 to 1620. Rijksmuseum, Amsterdam.',
    stampId: 'manipuri-1975',
  },
  {
    id: 'roslyn',
    title: 'Roslyn',
    detail: 'Rishab Rikhiram Sharma',
    audioSrc: 'audio/roslyn.mp3',
    raga: 'Madhumadhavi Ragini',
    ragaHindi: 'मधुमाधवी रागिनी',
    scene: 'A lady reaches for a peacock as storm clouds gather above the terrace.',
    painting: 'assets/ragamala/roslyn.webp',
    paintingWidth: 520,
    paintingHeight: 636,
    paintingCredit: 'Marwar, 1640 to 1650. The Metropolitan Museum of Art.',
    stampId: 'peafowl-1973',
  },
  {
    id: 'tilak-kamod',
    title: 'Tilak Kamod',
    detail: 'Rishab Rikhiram Sharma',
    audioSrc: 'audio/tilak-kamod.mp3',
    raga: 'Vilaval Ragini',
    ragaHindi: 'विलावल रागिनी',
    scene: 'Women gather in a blazing orange palace, one of them holding a veena.',
    painting: 'assets/ragamala/tilak-kamod.webp',
    paintingWidth: 520,
    paintingHeight: 702,
    paintingCredit: 'Ragamala series, c. 1680. The Metropolitan Museum of Art.',
    stampId: 'kalamkari-2009',
  },
  {
    id: 'rama-rama',
    title: 'Rama Rama',
    detail: 'Rishab Rikhiram Sharma',
    audioSrc: 'audio/rama-rama.mp3',
    raga: 'Rama and Sita',
    ragaHindi: 'राम सीता',
    scene: 'Enthroned Rama and Sita receive homage from their monkey and bear allies. JAI SHRI RAM!',
    painting: 'assets/ragamala/rama-rama.webp',
    paintingWidth: 520,
    paintingHeight: 793,
    paintingCredit: 'Pahari painting, 18th century. Cleveland Museum of Art.',
    stampId: 'ramayana-2017',
    collectionNote: 'Rama’s homecoming, with a song to go with it.',
  },
  {
    id: 'mera-satguru-pyaara',
    title: 'Mera Satguru Pyaara',
    detail: 'Live in Chandigarh · Rishab Rikhiram Sharma',
    audioSrc: 'audio/mera-satguru-pyaara.mp3',
    raga: 'Guru Nanak',
    ragaHindi: 'गुरु नानक',
    scene: 'Guru Nanak sits with Bala and Mardana, whose rabab accompanied his hymns.',
    painting: 'assets/ragamala/mera-satguru-pyaara.webp',
    paintingWidth: 520,
    paintingHeight: 700,
    paintingCredit: 'Painting, c. 1830.',
    stampId: 'guru-nanak-1969',
    collectionNote: "Guru Nanak sang to Mardana's rabab; this one is sung to the sitar.",
  },
  {
    id: 'the-burning-ghat',
    title: 'The Burning Ghat',
    detail: 'Rishab Rikhiram Sharma',
    audioSrc: 'audio/the-burning-ghat.mp3',
    raga: 'The Burning Ghats',
    ragaHindi: 'काशी के घाट',
    scene: 'Smoke rises from the cremation ground above the Ganga at Benares.',
    painting: 'assets/ragamala/the-burning-ghat.webp',
    paintingWidth: 520,
    paintingHeight: 492,
    paintingCredit: 'Marianne North, Benares, October 1878.',
    stampId: 'ghats-varanasi-1983',
    collectionNote: 'Listen to these steps at the water’s edge, played on the sitar.',
  },
]
