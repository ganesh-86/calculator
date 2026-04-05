export function evaluateExpression(tokens) {
  if (!tokens || tokens.length === 0) return '0';
  let calcTokens = [...tokens];

  // Pass 0: Constants Replacement
  for (let i = 0; i < calcTokens.length; i++) {
    if (calcTokens[i] === 'π') calcTokens[i] = Math.PI.toString();
    if (calcTokens[i] === 'e') calcTokens[i] = Math.E.toString();
  }

  // Trim trailing standard binary operators
  while (calcTokens.length > 0 && ['+', '-', '×', '÷', '^'].includes(calcTokens[calcTokens.length - 1])) {
    calcTokens.pop();
  }
  if (calcTokens.length === 0) return '0';

  // Pass 1: Postfix Unary (Square: ²)
  for (let i = 0; i < calcTokens.length; i++) {
    if (calcTokens[i] === '²') {
      if (i > 0) {
        const val = parseFloat(calcTokens[i-1]);
        calcTokens.splice(i-1, 2, (val * val).toString());
        i--;
      } else {
        calcTokens.splice(i, 1);
        i--;
      }
    }
  }

  // Pass 2: Prefix Unary (sin, cos, tan, log, ln, √) 
  for (let i = calcTokens.length - 1; i >= 0; i--) {
    const token = calcTokens[i];
    if (['sin', 'cos', 'tan', 'log', 'ln', '√'].includes(token)) {
      if (i + 1 < calcTokens.length) {
        const val = parseFloat(calcTokens[i+1]);
        if (isNaN(val)) continue;

        let res = 0;
        switch(token) {
          case 'sin': res = Math.sin(val); break;
          case 'cos': res = Math.cos(val); break;
          case 'tan': res = Math.tan(val); break;
          case 'log': res = Math.log10(val); break;
          case 'ln':  res = Math.log(val); break;
          case '√':   res = Math.sqrt(val); break;
        }
        calcTokens.splice(i, 2, res.toString());
      } else {
        calcTokens.splice(i, 1); 
      }
    }
  }

  // Pass 3: Power (^) Precedence
  let tempTokens = [];
  let i = 0;
  while (i < calcTokens.length) {
    if (calcTokens[i] === '^') {
      const prev = parseFloat(tempTokens.pop());
      const next = parseFloat(calcTokens[i+1]);
      if (!isNaN(prev) && !isNaN(next)) {
         tempTokens.push(Math.pow(prev, next).toString());
         i += 2;
         continue;
      }
    }
    tempTokens.push(calcTokens[i]);
    i++;
  }
  calcTokens = tempTokens;

  // Pass 4: Multiplication & Division
  tempTokens = [];
  i = 0;
  while (i < calcTokens.length) {
    const token = calcTokens[i];
    if (token === '×' || token === '÷') {
      const prev = parseFloat(tempTokens.pop());
      const nextStr = calcTokens[i+1];
      if (nextStr === undefined) break;

      const next = parseFloat(nextStr);
      if (!isNaN(prev) && !isNaN(next)) {
         if (token === '÷' && next === 0) return 'Error';
         tempTokens.push(token === '×' ? (prev * next).toString() : (prev / next).toString());
         i += 2;
         continue;
      }
    }
    tempTokens.push(calcTokens[i]);
    i++;
  }
  calcTokens = tempTokens;

  // Pass 5: Addition & Subtraction
  if (calcTokens.length === 0) return '0';
  let finalResult = parseFloat(calcTokens[0]);
  i = 1;
  while (i < calcTokens.length) {
    const op = calcTokens[i];
    const nextStr = calcTokens[i + 1];
    if (nextStr === undefined) break;

    const next = parseFloat(nextStr);
    if (!isNaN(next)) {
      if (op === '+') finalResult += next;
      else if (op === '-') finalResult -= next;
    }
    i += 2;
  }

  if (isNaN(finalResult) || !isFinite(finalResult)) return 'Error';
  
  // Clean decimal rounding for UI safety
  const precise = parseFloat(finalResult.toPrecision(12));
  return precise.toString();
}
