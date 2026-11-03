export interface EditorialCollection {
  id: string
  title: string
  devanagari?: string
  kicker: string
  intro: string
  accent: string
  stampIds: string[]
    threads: { from: string; to: string; text: string }[]
}

export const collections: EditorialCollection[] = [
  {
    id: 'built',
    title: 'Built in India',
    kicker: 'Architecture, monuments & places',
    intro:
      'When the Dominion of India designed its first definitives in 1949, it chose stone over sovereigns: temples, tombs and carved panels in place of a king’s profile.',
    accent: '#6e1f1c',
    stampIds: ['taj-mahal-1949', 'qutb-minar-1949', 'victoria-memorial-1935', 'konark-horse-1949', 'moti-masjid-bhopal-1938', 'ooty-telescope-1982'],
    threads: [
      { from: 'victoria-memorial-1935', to: 'taj-mahal-1949', text: 'Fourteen years apart: a king beside a memorial, then a monument with no king at all.' },
      { from: 'moti-masjid-bhopal-1938', to: 'dak-bullock-cart-nabha-1938', text: 'Two princely states in 1938: one printed its own stamps, one overprinted British India’s.' },
    ],
  },
  {
    id: 'living',
    title: 'The Living Landscape',
    devanagari: 'प्रकृति',
    kicker: 'Birds, wildlife & plants',
    intro: 'Tiger and peacock, oriole and holy basil: the subcontinent’s nature, at the scale of a fingertip.',
    accent: '#1f6b47',
    stampIds: ['tiger-1963', 'peafowl-1973', 'oriole-1975', 'tulsi-1997', 'amaltaas-2000'],
    threads: [
      { from: 'peafowl-1973', to: 'kalamkari-2009', text: 'The same bird, drawn in ink and natural dye on cotton.' },
      { from: 'amaltaas-2000', to: 'kathakali-1975', text: 'Amaltaas is Kerala’s state flower; Kathakali is Kerala’s dance-drama.' },
    ],
  },
  {
    id: 'minds',
    title: 'Minds That Moved India',
    devanagari: 'मनीषी',
    kicker: 'Scientists, writers & thinkers',
    intro: 'Poets in three languages, two physicists, a filmmaker and a satellite named for an astronomer fifteen centuries dead.',
    accent: '#26305e',
    stampIds: ['gandhi-1948', 'tagore-1952', 'bharati-1960', 'ghalib-1969', 'cv-raman-1971', 'homi-bhabha-1966', 'aryabhata-1975', 'pather-panchali-1994'],
    threads: [
      { from: 'tagore-1952', to: 'pather-panchali-1994', text: 'Bengal’s literature on screen: Ray studied at Tagore’s Santiniketan.' },
      { from: 'cv-raman-1971', to: 'homi-bhabha-1966', text: 'Two founders of modern Indian physics, five years apart on the post.' },
    ],
  },
  {
    id: 'rhythm',
    title: 'Rhythm, Thread & Tradition',
    devanagari: 'ताल',
    kicker: 'Music, dance, crafts & textiles',
    intro: 'Hand gestures and handlooms. Dances from Tamil Nadu, Kerala and Manipur sit beside ikat, Kalamkari and lost-wax brass.',
    accent: '#e58a1f',
    stampIds: ['bharatanatyam-1975', 'kathakali-1975', 'manipuri-1975', 'tyagaraja-1961', 'veena-1998', 'ravi-shankar-2016', 'kalamkari-2009', 'pochampally-ikat-2018', 'dhokra-2002', 'ajanta-panel-1949'],
    threads: [
      { from: 'tyagaraja-1961', to: 'bharatanatyam-1975', text: 'Carnatic music and Bharatanatyam grew up together in Tamil Nadu.' },
      { from: 'khadi-1950', to: 'pochampally-ikat-2018', text: 'From the charkha on Republic Day to handloom ikat, 68 years later.' },
    ],
  },
  {
    id: 'dak',
    title: 'On the Dak Road',
    devanagari: 'डाक',
    kicker: 'Postal history & transport',
    intro: 'Runner, bullock cart, coach, mail train, aeroplane: the post has always been a story about moving.',
    accent: '#a8874a',
    stampIds: ['punjabi-postman-1977', 'dak-bullock-cart-nabha-1938', 'dawk-gharry-1989', 'mail-train-1937', 'darjeeling-railway-1982', 'mail-transport-1954', 'khadi-1950'],
    threads: [
      { from: 'meghaduta-1960', to: 'punjabi-postman-1977', text: 'Kalidasa sent a message by cloud; the dak runner went on foot.' },
      { from: 'mail-train-1937', to: 'darjeeling-railway-1982', text: 'Steam on two stamps: the King’s mail train and the Himalayan toy train.' },
    ],
  },
]
