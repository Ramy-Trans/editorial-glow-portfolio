import redrock      from "./redrock.png";        // 912×912  AR=1.00 square
import casioMusic   from "./casio-music.png";    // 1893×951 AR=1.99 wide (original, pre-bg-removal)
import alsson       from "./alsson-new.webp";    // 798×912  AR=0.88 portrait
import afreximbank  from "./afreximbank-new.png";// 912×912  AR=1.00 square
import modernTouch  from "./modern-touch-new.png";// 875×875 AR=1.00 square
import kufpec       from "./kufpec.png";         // 233×170  AR=1.37
import sparix       from "./sparix.jpg";         // 326×147  AR=2.22 wide
import livingYards  from "./living-yards.webp";  // 300×300  AR=1.00 square
import newgiza      from "./newgiza.png";        // 2953×1930 AR=1.53
import impact       from "./impact.png";         // 4500×4500 AR=1.00 square
import kingred      from "./kingred.png";        // 1080×1080 AR=1.00 square
import hedya        from "./hedya.png";          // 598×310  AR=1.93 wide

// imgH/imgW = max constraints on the <img> tag.
// Container row is fixed at 132px so all logos have room to breathe.
export const clientLogos = [
  { src: redrock,      alt: "RedRock International",   imgH: 80,  imgW: 160 },
  { src: casioMusic,   alt: "Casio Music",             imgH: 80,  imgW: 160 },
  { src: alsson,       alt: "El Alsson School",        imgH: 88,  imgW: 78  },
  { src: afreximbank,  alt: "Afreximbank",             imgH: 80,  imgW: 80  },
  { src: kufpec,       alt: "KUFPEC",                  imgH: 76,  imgW: 104 },
  { src: sparix,       alt: "Spirax Sarco",            imgH: 60,  imgW: 134 },
  { src: modernTouch,  alt: "Modern Touch",            imgH: 80,  imgW: 80  },
  { src: livingYards,  alt: "Living Yards",            imgH: 80,  imgW: 80  },
  { src: newgiza,      alt: "New Giza",                imgH: 70,  imgW: 108 },
  { src: impact,       alt: "Impact",                  imgH: 80,  imgW: 80  },
  { src: kingred,      alt: "Kingred Youth",           imgH: 76,  imgW: 76  },
  { src: hedya,        alt: "Hedya",                   imgH: 64,  imgW: 124 },
];
