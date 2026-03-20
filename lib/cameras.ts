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
    thumbnail: "https://img.youtube.com/vi/8kSxFbFsxHs/maxresdefault.jpg",
    description: "A ilha mais romântica da Grécia, com suas casas brancas e cúpulas azuis sobre o mar Egeu.",
  },
  {
    id: "shibuya",
    name: "Shibuya Crossing",
    location: "Tóquio",
    country: "Japão",
    embedUrl: "https://www.youtube.com/embed/cMqHDMBGsvk?autoplay=1&mute=1",
    thumbnail: "https://img.youtube.com/vi/cMqHDMBGsvk/maxresdefault.jpg",
    description: "O cruzamento mais movimentado do mundo, no coração de Tóquio.",
  },
  {
    id: "eiffel",
    name: "Torre Eiffel",
    location: "Paris",
    country: "França",
    embedUrl: "https://www.youtube.com/embed/MzDBnWpGBKE?autoplay=1&mute=1",
    thumbnail: "https://img.youtube.com/vi/MzDBnWpGBKE/maxresdefault.jpg",
    description: "O símbolo eterno de Paris e da França, iluminada todas as noites.",
  },
  {
    id: "cristo-redentor",
    name: "Cristo Redentor",
    location: "Rio de Janeiro",
    country: "Brasil",
    embedUrl: "https://www.youtube.com/embed/0pEB8RJKZQM?autoplay=1&mute=1",
    thumbnail: "https://img.youtube.com/vi/0pEB8RJKZQM/maxresdefault.jpg",
    description: "Uma das maravilhas do mundo moderno, de braços abertos sobre a Cidade Maravilhosa.",
  },
  {
    id: "san-marco",
    name: "Piazza San Marco",
    location: "Veneza",
    country: "Itália",
    embedUrl: "https://www.youtube.com/embed/dGXSBFqJDpQ?autoplay=1&mute=1",
    thumbnail: "https://img.youtube.com/vi/dGXSBFqJDpQ/maxresdefault.jpg",
    description: "A praça mais famosa de Veneza, cercada por arquitetura gótica e byzantine.",
  },
  {
    id: "big-ben",
    name: "Big Ben",
    location: "Londres",
    country: "Reino Unido",
    embedUrl: "https://www.youtube.com/embed/VFdPSdSGBSQ?autoplay=1&mute=1",
    thumbnail: "https://img.youtube.com/vi/VFdPSdSGBSQ/maxresdefault.jpg",
    description: "O icônico relógio de Londres, símbolo do Parlamento britânico.",
  },
  {
    id: "statue-liberty",
    name: "Estátua da Liberdade",
    location: "Nova York",
    country: "EUA",
    embedUrl: "https://www.youtube.com/embed/LFIuMeVXBJA?autoplay=1&mute=1",
    thumbnail: "https://img.youtube.com/vi/LFIuMeVXBJA/maxresdefault.jpg",
    description: "O símbolo da liberdade americana, presente na entrada do porto de Nova York.",
  },
  {
    id: "colosseum",
    name: "Coliseu",
    location: "Roma",
    country: "Itália",
    embedUrl: "https://www.youtube.com/embed/SBCw4_XgouA?autoplay=1&mute=1",
    thumbnail: "https://img.youtube.com/vi/SBCw4_XgouA/maxresdefault.jpg",
    description: "O maior anfiteatro da Antiguidade, no coração de Roma.",
  },
  {
    id: "niagara",
    name: "Cataratas do Niágara",
    location: "Niágara",
    country: "EUA/Canadá",
    embedUrl: "https://www.youtube.com/embed/8aqBJSVkMwI?autoplay=1&mute=1",
    thumbnail: "https://img.youtube.com/vi/8aqBJSVkMwI/maxresdefault.jpg",
    description: "Uma das maiores cataratas do mundo, na fronteira entre EUA e Canadá.",
  },
];
