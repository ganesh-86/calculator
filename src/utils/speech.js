export const getSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    return recognition;
};

export const parseSpeechToMath = (transcript) => {
    // Basic translation dictionary for spoken string to tokens
    let formatted = transcript.toLowerCase();
    
    // Numbers
    const textToNumber = {
        'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
        'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10',
        'to': '2', // phonetic accident catching
        'too': '2',
        'for': '4',
        'tree': '3',
    };
    
    // Operators
    const textToOp = {
        'plus': '+', 'add': '+',
        'minus': '-', 'subtract': '-',
        'times': '×', 'multiplied by': '×', '*': '×', 'x': '×',
        'divided by': '÷', 'over': '÷', '/': '÷',
        'power': '^', 'to the power of': '^',
        'squared': '²',
        'sine': 'sin', 'cos': 'cos', 'tangent': 'tan',
        'root': '√', 'square root': '√',
        'equals': '=',
        'point': '.', 'dot': '.'
    };

    Object.keys(textToNumber).forEach(key => {
        formatted = formatted.replace(new RegExp(`\\b${key}\\b`, 'gi'), textToNumber[key]);
    });

    Object.keys(textToOp).forEach(key => {
        formatted = formatted.replace(new RegExp(`${key}`, 'gi'), ` ${textToOp[key]} `);
    });

    // Remove extra spaces and extract clean tokens
    const rawTokens = formatted.replace(/\s+/g, ' ').trim().split(' ');
    
    // Filter out meaningless words
    const validMathRegex = /^([0-9.]+|[\+\-\×\÷\^\²\√]|sin|cos|tan|log|ln|π|e|=)$/i;
    const cleanTokens = rawTokens.filter(t => validMathRegex.test(t));
    
    return cleanTokens;
};
