export function evaluateExpression(tokens) {
  // Guard against empty array
  if (!tokens || tokens.length === 0) return '0';

  // Make a shallow copy to prevent mutations from affecting state
  let calcTokens = [...tokens];

  // 1. Trim trailing operators (e.g., "return 2 + 3" from "2 + 3 +")
  while (calcTokens.length > 0 && ['+', '-', '×', '÷'].includes(calcTokens[calcTokens.length - 1])) {
    calcTokens.pop();
  }
  
  if (calcTokens.length === 0) return '0';

  // 2. Pass 1: Multiplication & Division
  let tempTokens = [];
  let i = 0;
  while (i < calcTokens.length) {
    const token = calcTokens[i];
    if (token === '×' || token === '÷') {
      const prevStr = tempTokens.pop();
      const op = token;
      i++;
      const nextStr = calcTokens[i];
      
      const prev = parseFloat(prevStr);
      const next = parseFloat(nextStr);
      
      let res;
      if (op === '×') {
        res = prev * next;
      } else {
        if (next === 0) return 'Error';
        res = prev / next;
      }
      tempTokens.push(res.toString());
    } else {
      tempTokens.push(token);
    }
    i++;
  }

  // 3. Pass 2: Addition & Subtraction
  let finalResult = parseFloat(tempTokens[0]);
  i = 1;
  while (i < tempTokens.length) {
    const op = tempTokens[i];
    const nextStr = tempTokens[i + 1];
    const next = parseFloat(nextStr);
    
    if (op === '+') {
      finalResult += next;
    } else if (op === '-') {
      finalResult -= next;
    }
    i += 2;
  }

  // Final sanity checks
  if (isNaN(finalResult)) return 'Error';
  
  // Format to avoid extreme floating point issues (e.g. 0.1 + 0.2)
  return parseFloat(finalResult.toPrecision(12)).toString();
}
