export interface Camera {
  id: string;
  name: string;
  location: string;
  country: string;
  embedUrl: string;
  thumbnail: string;
  description: string;
}

export const cameras: Camera[] = [
  {
    id: "times-square",
    name: "Times Square",
    location: "Nova York",
    country: "EUA",
    embedUrl: "https://www.youtube.com/embed/1EiC9bvVGnk?autoplay=1&mute=1",
    thumbnail: "https://img.youtube.com/vi/1EiC9bvVGnk/maxresdefault.jpg",
    description: "O coração pulsante de Nova York, com seus letreiros luminosos e multidões 24 horas por dia.",
  },
  {
    id: "santorini",
    name: "Santorini",
    location: "Santorini",
    country: "Grécia",
    embedUrl: "https://www.youtube.com/embed/8kSxFbFsxHs?autoplay=1&mute=1",
    thumbnail: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1280&h=720&fit=crop",
    description: "A ilha mais romântica da Grécia, com suas casas brancas e cúpulas azuis sobre o mar Egeu.",
  },
  {
    id: "shibuya",
    name: "Shibuya Crossing",
    location: "Tóquio",
    country: "Japão",
    embedUrl: "https://www.youtube.com/embed/cMqHDMBGsvk?autoplay=1&mute=1",
    thumbnail: "https://images.unsplash.com/photo-1540959375944-7049f642e9a4?w=1280&h=720&fit=crop",
    description: "O cruzamento mais movimentado do mundo, no coração de Tóquio.",
  },
  {
    id: "eiffel",
    name: "Torre Eiffel",
    location: "Paris",
    country: "França",
    embedUrl: "https://www.youtube.com/embed/MzDBnWpGBKE?autoplay=1&mute=1",
    thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1280&h=720&fit=crop",
    description: "O símbolo eterno de Paris e da França, iluminada todas as noites.",
  },
  {
    id: "cristo-redentor",
    name: "Cristo Redentor",
    location: "Rio de Janeiro",
    country: "Brasil",
    embedUrl: "https://www.youtube.com/embed/0pEB8RJKZQM?autoplay=1&mute=1",
    thumbnail: "https://images.unsplash.com/photo-1483729558449-99daa64c3104?w=1280&h=720&fit=crop",
    description: "Uma das maravilhas do mundo moderno, de braços abertos sobre a Cidade Maravilhosa.",
  },
  {
    id: "san-marco",
    name: "Piazza San Marco",
    location: "Veneza",
    country: "Itália",
    embedUrl: "https://www.youtube.com/embed/dGXSBFqJDpQ?autoplay=1&mute=1",
    thumbnail: "https://images.unsplash.com/photo-1514890547357-a9db7a547e59?w=1280&h=720&fit=crop",
    description: "A praça mais famosa de Veneza, cercada por arquitetura gótica e byzantine.",
  },
  {
    id: "big-ben",
    name: "Big Ben",
    location: "Londres",
    country: "Reino Unido",
    embedUrl: "https://www.youtube.com/embed/VFdPSdSGBSQ?autoplay=1&mute=1",
    thumbnail: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1280&h=720&fit=crop",
    description: "O icônico relógio de Londres, símbolo do Parlamento britânico.",
  },
  {
    id: "statue-liberty",
    name: "Estátua da Liberdade",
    location: "Nova York",
    country: "EUA",
    embedUrl: "https://www.youtube.com/embed/LFIuMeVXBJA?autoplay=1&mute=1",
    thumbnail: "https://images.unsplash.com/photo-1518235506717-e1ed3306a326?w=1280&h=720&fit=crop",
    description: "O símbolo da liberdade americana, presente na entrada do porto de Nova York.",
  },
  {
    id: "colosseum",
    name: "Coliseu",
    location: "Roma",
    country: "Itália",
    embedUrl: "https://www.youtube.com/embed/SBCw4_XgouA?autoplay=1&mute=1",
    thumbnail: "https://images.unsplash.com/photo-1552832860-cfb67165eaf0?w=1280&h=720&fit=crop",
    description: "O maior anfiteatro da Antiguidade, no coração de Roma.",
  },
  {
    id: "niagara",
    name: "Cataratas do Niágara",
    location: "Niágara",
    country: "EUA/Canadá",
    embedUrl: "https://www.youtube.com/embed/8aqBJSVkMwI?autoplay=1&mute=1",
    thumbnail: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1280&h=720&fit=crop",
    description: "Uma das maiores cataratas do mundo, na fronteira entre EUA e Canadá.",
  },
];
