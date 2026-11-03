// Dimensions inferred from the approved photograph; conservative default poses keep every display readable from the front.
export const screens = [
  {
    "id": "screen.upper_left",
    "texture": "upper_left",
    "position": [
      -2.75798,
      6.9073,
      0.1
    ],
    "rotation": [
      0.35,
      0.93708,
      -0.52719
    ],
    "size": [
      1.67916,
      1.49603,
      1.12
    ],
    "bezel": 0.17,
    "acrylic": 0.18,
    "label": "UPPER LEFT / AIR FLIGHT"
  },
  {
    "id": "screen.upper_center",
    "texture": "upper_center",
    "position": [
      -0.03945,
      6.59332,
      -2.0
    ],
    "rotation": [
      -0.19293,
      -0.01103,
      -0.00032
    ],
    "size": [
      2.95455,
      2.01149,
      0.38
    ],
    "bezel": 0.16,
    "acrylic": 0.16,
    "label": "UPPER CENTER / SUN AND MOON"
  },
  {
    "id": "screen.upper_right",
    "texture": "upper_right",
    "position": [
      3.11157,
      6.75164,
      0.1
    ],
    "rotation": [
      0.09112,
      -0.86736,
      0.27333
    ],
    "size": [
      2.02328,
      1.63407,
      1.12
    ],
    "bezel": 0.17,
    "acrylic": 0.17,
    "label": "UPPER RIGHT / MARINE ENCOUNTER"
  },
  {
    "id": "screen.center_main",
    "texture": "center_main",
    "position": [
      0.206,
      4.09599,
      -1.85
    ],
    "rotation": [
      -0.06088,
      0.0,
      0.0
    ],
    "size": [
      3.96422,
      2.48295,
      0.43
    ],
    "bezel": 0.14,
    "acrylic": 0.12,
    "label": "CENTER / FLOWER"
  },
  {
    "id": "screen.portrait_left",
    "texture": "portrait_left",
    "position": [
      -2.59977,
      3.985,
      -1.1
    ],
    "rotation": [
      -0.26368,
      0.33,
      0.01623
    ],
    "size": [
      1.25283,
      2.7523,
      0.49
    ],
    "bezel": 0.13,
    "acrylic": 0.13,
    "label": "PORTRAIT LEFT / AIR FIBRE"
  },
  {
    "id": "screen.left.01",
    "texture": "left_01",
    "position": [
      -3.75207,
      4.90613,
      1.1
    ],
    "rotation": [
      -0.29909,
      0.83,
      0.02337
    ],
    "size": [
      0.84506,
      0.88502,
      0.69
    ],
    "bezel": 0.12,
    "acrylic": 0.08,
    "label": "LEFT 01 / LANDSCAPE"
  },
  {
    "id": "screen.left.02",
    "texture": "left_02",
    "position": [
      -3.61584,
      3.5906,
      1.24
    ],
    "rotation": [
      -0.22971,
      0.69475,
      0.02635
    ],
    "size": [
      0.95595,
      1.09437,
      0.72
    ],
    "bezel": 0.13,
    "acrylic": 0.08,
    "label": "LEFT 02 / AIR CURRENT"
  },
  {
    "id": "screen.left.03",
    "texture": "left_03",
    "position": [
      -3.46581,
      2.06781,
      1.4
    ],
    "rotation": [
      -0.05528,
      0.73,
      -0.00079
    ],
    "size": [
      1.1417,
      1.31072,
      0.84
    ],
    "bezel": 0.13,
    "acrylic": 0.08,
    "label": "LEFT 03 / AIR TRACE"
  },
  {
    "id": "screen.right.01",
    "texture": "right_01",
    "position": [
      3.65645,
      5.18,
      1.05
    ],
    "rotation": [
      -0.29512,
      -0.62759,
      -0.03209
    ],
    "size": [
      1.02035,
      0.95244,
      0.71
    ],
    "bezel": 0.13,
    "acrylic": 0.08,
    "label": "RIGHT 01 / MARINE SOUND LIFE"
  },
  {
    "id": "screen.right.02",
    "texture": "right_02",
    "position": [
      3.40144,
      3.04428,
      1.22
    ],
    "rotation": [
      -0.14059,
      -0.78,
      -0.01251
    ],
    "size": [
      1.33353,
      1.11994,
      0.78
    ],
    "bezel": 0.13,
    "acrylic": 0.08,
    "label": "RIGHT 02 / MARINE TISSUE"
  },
  {
    "id": "screen.right.03",
    "texture": "right_03",
    "position": [
      3.38438,
      1.678,
      1.45
    ],
    "rotation": [
      -0.02668,
      -0.73,
      0.01076
    ],
    "size": [
      1.29504,
      1.2442,
      0.83
    ],
    "bezel": 0.14,
    "acrylic": 0.08,
    "label": "RIGHT 03 / MARINE INDEX"
  },
  {
    "id": "screen.desk",
    "texture": "desk",
    "position": [
      2.68,
      4.08,
      -0.72
    ],
    "rotation": [
      0,
      -0.12,
      0
    ],
    "size": [
      0.83955,
      1.052925,
      0.58
    ],
    "bezel": 0.055,
    "acrylic": 0.025,
    "label": "CENTER RIGHT / CAMERA"
  }
];
export const seatFocus=[0,2.9,1];
for(const screen of screens){
 const inward=screen.position[0]<0?1:-1;
 if(screen.id==='screen.center_main')screen.rotation=[0,0,0];
 else if(screen.id==='screen.upper_center')screen.rotation=[.12,0,0];
 else if(screen.id==='screen.upper_left'||screen.id==='screen.upper_right')screen.rotation=[.12,inward*.32,inward*-.06];
 else if(screen.id==='screen.desk')screen.rotation=[0,inward*.12,0];
 else screen.rotation=[0,inward*.22,0];
}
export const cabinetSpecs = [
  {id:'cabinet.left.upper',position:[-4.84,5.96,1.63],size:[1.17,2.02,.83],rotation:.5,seed:11},
  {id:'cabinet.left.middle',position:[-4.97,3.72,1.81],size:[1.28,1.55,.95],rotation:.48,seed:22},
  {id:'cabinet.left.lower',position:[-4.84,2.10,1.79],size:[1.22,1.67,.95],rotation:.48,seed:33},
  {id:'cabinet.right.upper',position:[4.86,6.48,1.49],size:[1.14,1.31,.81],rotation:-.5,seed:44},
  {id:'cabinet.right.middle',position:[4.9,4.52,1.78],size:[1.3,2.13,.97],rotation:-.48,seed:55},
  {id:'cabinet.right.lower',position:[4.83,1.75,1.88],size:[1.28,1.88,.96],rotation:-.46,seed:66},
];
export const screenDesign = {
  'screen.upper_left': {model:'translucent-crt', resolution:[640,480]},
  'screen.upper_center': {model:'studio-crt', resolution:[800,600]},
  'screen.upper_right': {model:'studio-crt', resolution:[800,600]},
  'screen.center_main': {model:'studio-crt', resolution:[1024,768]},
  'screen.portrait_left': {model:'portrait-crt', resolution:[600,1200]},
  'screen.left.01': {model:'compact-crt', resolution:[640,480]},
  'screen.left.02': {model:'compact-crt', resolution:[640,480]},
  'screen.left.03': {model:'translucent-crt', resolution:[800,600]},
  'screen.right.01': {model:'compact-crt', resolution:[640,480]},
  'screen.right.02': {model:'translucent-crt', resolution:[800,600]},
  'screen.right.03': {model:'compact-crt', resolution:[800,600]},
  'screen.desk': {model:'micro-crt', resolution:[320,400]},
};

export const displayDefaults = {
  mode:'image', brightness:1, saturation:.88, contrast:1.04, tint:'#dce8e5', scanlines:.09, flip:false,
};

export const sceneSettings = {
  background:'#466f87',
  fog:{near:33,far:95},
  exposure:.96,
  environmentIntensity:.57,
  hemisphere:{sky:'#b2d3e2',ground:'#857c69',intensity:1.4},
  key:{color:'#f3ead7',intensity:2.05,position:[-7,11,8]},
  fill:{color:'#c4e3ef',intensity:1.1,position:[8,8,5]},
  rim:{color:'#d5e7e8',intensity:1.25,position:[3,6,-6]},
  floor:{color:'#517f93',roughness:.53,metalness:.12},
  grain:.018,
  pixelRatioLimit:1.6,
};

export const views = {
  reference:{position:[0,5.86,28],target:[0,4.15,0],fov:21.3},
  front:{position:[0,4.5,28],target:[0,4.5,0],fov:24},
  left:{position:[-16,7.6,13],target:[0,4.4,0],fov:34},
  right:{position:[16,7.6,13],target:[0,4.4,0],fov:34},
  back:{position:[0,7.1,-24],target:[0,4.4,0],fov:28},
  top:{position:[0,22,4],target:[0,2.5,0],fov:38},
  seat:{position:[-.06,2.65,1.1],target:[0,4.35,-1.5],fov:64},
};
