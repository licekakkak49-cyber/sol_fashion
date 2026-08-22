const arr = [
  { layoutSize: 'small' }, // S1 (0,0) -> 0
  { layoutSize: 'small' }, // S2 (1,0) -> 1
  { layoutSize: 'large' }, // L  (2,0) -> 2
  { layoutSize: 'small' }, // S3 (0,1) -> 4
  { layoutSize: 'small' }  // S4 (1,1) -> 5
];

// If the user arranged it as 4+1, it saves as S, S, L, S, S.
// We should update the pattern detection to recognize this!
