import { INDONESIA_ISLANDS, polygonPath } from "@/lib/indonesia-geometry";
function globePoint(lon: number, lat: number) {
  const r = Math.PI / 180;
  const lambda = (lon - 118) * r;
  const phi = lat * r;
  const center = -5 * r;
  return [
    720 + 290 * Math.cos(phi) * Math.sin(lambda),
    280 -
      290 *
        (Math.cos(center) * Math.sin(phi) -
          Math.sin(center) * Math.cos(phi) * Math.cos(lambda)),
  ];
}
const neighbors = [
  [
    [75, 8],
    [73, 20],
    [79, 30],
    [92, 29],
    [100, 35],
    [110, 40],
    [123, 40],
    [130, 34],
    [120, 25],
    [111, 20],
    [109, 12],
    [106, 9],
    [104, 11],
    [103, 15],
    [101, 14],
    [100, 6],
    [103, 1],
    [104, 1],
    [103, 6],
    [99, 11],
    [97, 17],
    [94, 18],
    [91, 22],
    [87, 21],
    [82, 16],
    [79, 8],
  ],
  [
    [113, -22],
    [115, -21],
    [121, -18],
    [124, -15],
    [127, -14],
    [130, -12],
    [133, -12],
    [136, -15],
    [138, -16],
    [141, -12],
    [142, -11],
    [145, -16],
    [148, -20],
    [153, -27],
    [151, -34],
    [145, -38],
    [137, -35],
    [130, -32],
    [123, -34],
    [115, -34],
  ],
  [
    [120, 18],
    [122, 17],
    [123, 13],
    [125, 11],
    [126, 7],
    [124, 6],
    [122, 9],
    [120, 12],
  ],
  [
    [141, -2.6],
    [145, -4],
    [149, -6],
    [151, -9],
    [147, -10],
    [144, -8],
    [141, -9.1],
  ],
  [
    [109.8, 2],
    [113, 3],
    [116, 7],
    [119, 6],
    [117.6, 4.2],
    [115.6, 3],
    [114.3, 1.4],
    [112.4, 1.6],
    [111.8, 1],
    [110.6, 1],
  ],
];
export function IndonesiaEarth() {
  return (
    <div
      className="pointer-events-none relative overflow-hidden bg-[#030c1c]"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 520"
        className="mx-auto h-[260px] w-full sm:h-[380px] lg:h-[440px]"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="earth-ocean" cx="32%" cy="26%" r="78%">
            <stop stopColor="#1e6b8d" />
            <stop offset=".45" stopColor="#103952" />
            <stop offset=".8" stopColor="#071b30" />
            <stop offset="1" stopColor="#020611" />
          </radialGradient>
          <radialGradient id="earth-atmosphere">
            <stop offset=".8" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset=".93" stopColor="#38bdf8" stopOpacity=".15" />
            <stop offset=".97" stopColor="#38bdf8" stopOpacity=".4" />
            <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="earth-land" x2="1" y2="1">
            <stop stopColor="#427875" />
            <stop offset="1" stopColor="#183a40" />
          </linearGradient>
          <radialGradient id="earth-shadow" cx="20%" cy="15%" r="90%">
            <stop offset=".4" stopColor="#020617" stopOpacity="0" />
            <stop offset="1" stopColor="#020617" stopOpacity=".85" />
          </radialGradient>
          <clipPath id="earth-disc">
            <circle cx="720" cy="280" r="290" />
          </clipPath>
          <pattern
            id="space-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M60 0H0V60"
              fill="none"
              stroke="#164e63"
              strokeOpacity=".18"
            />
          </pattern>
        </defs>
        <rect width="1200" height="520" fill="url(#space-grid)" />
        {Array.from({ length: 55 }, (_, i) => (
          <circle
            key={i}
            cx={(i * 193 + 17) % 1200}
            cy={(i * 97 + 11) % 520}
            r={i % 4 === 0 ? 1.3 : 0.7}
            fill="#a5d9ed"
            opacity={0.2 + (i % 5) * 0.13}
          />
        ))}
        <circle cx="720" cy="280" r="311" fill="url(#earth-atmosphere)" />
        <circle
          cx="720"
          cy="280"
          r="290"
          fill="url(#earth-ocean)"
          stroke="#67e8f9"
          strokeOpacity=".3"
        />
        <g clipPath="url(#earth-disc)">
          {neighbors.map((coordinates, i) => (
            <path
              key={i}
              d={polygonPath(coordinates, globePoint)}
              fill="url(#earth-land)"
              stroke="#5b8c84"
              strokeOpacity=".35"
            />
          ))}
          {INDONESIA_ISLANDS.map((island) => (
            <path
              key={island.name}
              d={polygonPath(island.coordinates, globePoint)}
              fill="#579a85"
              stroke="#a7f3d0"
              strokeOpacity=".65"
              strokeWidth=".8"
            />
          ))}
          <g fill="none" stroke="#bae6fd" strokeWidth=".5" opacity=".15">
            <ellipse cx="720" cy="280" rx="145" ry="290" />
            <ellipse cx="720" cy="280" rx="245" ry="290" />
            <ellipse cx="720" cy="280" rx="290" ry="90" />
            <ellipse cx="720" cy="280" rx="290" ry="190" />
          </g>
          <g
            fill="none"
            stroke="#e0f2fe"
            strokeLinecap="round"
            opacity=".1"
            strokeWidth="14"
          >
            <path d="M500 180Q580 155 640 190T800 180" />
            <path d="M780 360Q830 330 900 365" />
            <path d="M540 400Q590 380 645 410" />
          </g>
          <circle cx="720" cy="280" r="290" fill="url(#earth-shadow)" />
          <g fill="none" stroke="#67e8f9" strokeWidth="1" opacity=".65">
            <path d="M665 286Q730 220 800 275" />
            <path d="M665 286Q640 247 625 240" />
            <path d="M665 286Q690 258 725 282" />
          </g>
          {[
            [106.85, -6.21],
            [98.67, 3.59],
            [119.41, -5.15],
            [140.72, -2.53],
            [115.22, -8.65],
          ].map(([lon, lat]) => {
            const [x, y] = globePoint(lon, lat);
            return (
              <g key={lon}>
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill="#67e8f9"
                  opacity=".15"
                  className="earth-beacon"
                />
                <circle cx={x} cy={y} r="2" fill="#a5f3fc" />
              </g>
            );
          })}
        </g>
        <g fill="#a5f3fc" fontFamily="monospace">
          <text x="110" y="188" fontSize="11" letterSpacing="4">
            CONNECTED THROUGH SCIENCE
          </text>
          <text x="110" y="232" fontSize="34" fill="#f0f9ff" letterSpacing="2">
            NUSANTARA
          </text>
          <text x="110" y="262" fontSize="13" fill="#94a3b8">
            Satu bumi. Ribuan gagasan.
          </text>
          <path d="M110 285H250" stroke="#22d3ee" strokeWidth="2" />
          <text x="110" y="313" fontSize="10" letterSpacing="2">
            INDONESIA / 118° E · 5° S
          </text>
        </g>
        <g fill="none" stroke="#67e8f9" opacity=".45">
          <path d="M670 293L630 340H520" />
          <circle cx="670" cy="293" r="14" />
        </g>
        <text
          x="520"
          y="360"
          fontFamily="monospace"
          fontSize="10"
          letterSpacing="3"
          fill="#a5f3fc"
        >
          INDONESIA
        </text>
      </svg>
    </div>
  );
}
